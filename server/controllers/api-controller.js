const fetch = require('node-fetch');
const redis = require('redis');
const client = redis.createClient();
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);

client.on('error', function (error) {
  console.error(error);
});

const invalidDataError = require('../constants/errors/invalid-data');

const controller = {};

controller.apiQueries = (req, res, next) => {
  const civicAPI = process.env.CIVIC_API_KEY;
  const mapsAPI = process.env.MAPS_API_KEY;

  // console.log('civicAPI:', civicAPI);
  // console.log('mapsAPI:', mapsAPI);

  // using an object for user location so we have their address, their longitude, and their latitude from the query parameters.
  const userLocation = {};
  console.log('query - > ', req.query);
  if (req.query) {
    userLocation.address = req.query.address;
    userLocation.lat = req.query.lat;
    userLocation.long = req.query.long;
  }
  // need to add error handling here!

  // getting election ids
  const getElectionId = () => {
    // placeholder for election id
    let electionId;
    return fetch(
      `https://www.googleapis.com/civicinfo/v2/elections?key=${civicAPI}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'Application/JSON',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // shorter reference to elections array. each element will be an object
        const { elections } = data;
        // save the last two characters from the address to get the state's shorthand, and convert to lowercase
        const stateCode = userLocation.address
          .substring(userLocation.address.length - 2)
          .toLowerCase();
        // create an array to save elections that match the location
        const matchingElections = [];
        // iterate over the elections object
        for (let i = 0; i < elections.length; i += 1) {
          // look at the ocdDivisionId of each election to check for country-wide or state-specific elections
          // if it's country wide, we'll only get 'ocd-division/country:us'
          // if it's state-specific, we'll get 'ocd-division/country:us/state:[CODE]'
          // where [CODE] is the two letter shorthand for the state of the address passed in, in lowercase
          // for example 'co' for colorado, or 'wa' for washington
          // we filter out elections with id 2000 because that is a test election
          if (
            (elections[i].ocdDivisionId === 'ocd-division/country:us' ||
              elections[i].ocdDivisionId.includes(`state:${stateCode}`)) &&
            elections[i].id !== '2000'
          ) {
            matchingElections.push(elections[i]);
          }
        }

        // if we get no matches, we have to let the user know there are no upcoming elections
        if (matchingElections.length === 0) {
          // and skip the next fetch because there is no election to get data about
          return next(`No upcoming Elections for ${userLocation.address}.`);
        }
        // if we get a match for more than one election, check electionDay for the earliest date
        if (matchingElections.length > 0) {
          // then sort the elections by date
          matchingElections.sort((a, b) => (a.id > b.id ? 1 : -1));
          // otherwise we can grab the first id from the election object with the earliest date, and save it in electionId
          electionId = parseInt(matchingElections[0].id, 10);
        }
        return electionId;
      })
      .catch((err) =>
        console.log(
          `ERROR in server attempting to get Election ids. Error is: ${err}`
        )
      );
  };

  // getting info about the next election based on address passed in
  const getElectionData = (electionId) => {
    console.log('elec id ->', electionId);
    // if it's defined, pass it to the API with the address and api key to get the matching election info
    // we also only accept the election info that is marked as "official" in the API using the "officialOnly=true"
    return fetch(
      `https://www.googleapis.com/civicinfo/v2/voterinfo?key=${civicAPI}&address=${userLocation.address}&electionId=${electionId}&officialOnly=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'Application/JSON',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // check to make sure we've got an object with an election property, and that the id matches the one we wanted
        if (parseInt(data.election.id, 10) === electionId) {
          // if so, save it in electionData
          return data;
        }
        // otherwise, return an error
        next(invalidDataError(electionId));
      })
      .catch((err) =>
        console.log(
          `ERROR in server attempting to get election info for ${userLocation.address}. Error is: ${err}`
        )
      );
  };

  const checkRedisOrGeocode = async (address) => {
    // query string
    const queryURI = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${mapsAPI}`;

    let coordsObj;
    // check to see if address is in Redis
    await getAsync(address)
      .then((reply) => {
        // if it is, store the data in coordsObj
        if (reply) coordsObj = JSON.parse(reply);
      })
      .catch((err) => console.log(err));

    // no Redis data, so we need to query the google maps API for lat and long
    if (coordsObj === undefined) {
      console.log('no data found in Redis');
      return fetch(queryURI)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.results.length === 0) console.log('address ->', address);
          else if (
            resp.results[0].geometry.location.hasOwnProperty('lat') &&
            resp.results[0].geometry.location.hasOwnProperty('lng')
          ) {
            const locationObj = {
              latitude: resp.results[0].geometry.location.lat,
              longitude: resp.results[0].geometry.location.lng,
            };
            client.set(address, JSON.stringify(locationObj));
            return locationObj;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // data found in Redis, so return Promisified version of coordsObj
    console.log('data found in Redis');
    return new Promise((resolve, reject) => {
      resolve(coordsObj);
      reject(new Error('Error wth Redis getting lat and lng'));
    });
  };

  // to geocode an address, we need to make a get request from this URL with the address
  // `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${mapsAPI}`
  // the resulting long/lat for each will be in results[index].geometry.location.lat and
  // results[index].geometry.location.long
  // in general, we'll want to use results[0] because other results are just if it's unsure
  // about the address and gives multiple responses

  const geoCodeSubArray = async (array) => {
    // create an array to hold all of our API requests
    const promises = [];
    // iterate over array
    for (let i = 0; i < array.length; i += 1) {
      // simpler reference to the location for the current element
      const location = array[i].address;
      // appending together the first line of the address with the city and state
      let currentAddress = `${location.line1} ${location.city} ${location.state}`.replace(
        /[/\<>!#@$&+,;:?="#%]/g,
        ''
      );
      // encoding the address so we can use it in the query URI
      currentAddress = encodeURI(currentAddress);
      // const queryURI = `https://maps.googleapis.com/maps/api/geocode/json?address=${currentAddress}&key=${mapsAPI}`;
      // push the fetch request to our promises array
      // promises.push(fetch(queryURI).then((fetchRes) => fetchRes.json()));
      const tempPromise = checkRedisOrGeocode(currentAddress);
      console.log(tempPromise);
      promises.push(checkRedisOrGeocode(currentAddress));
    }

    // wait for all fetch requests to resolve
    await Promise.all(promises)
      .then((responses) => {
        // console.log('responses ->', responses);
        responses.forEach((data, i) => {
          // console.log('data ->', data);
          const location = array[i].address;
          // set the address latitude and longitude to the data we got back from the fetch request
          if (
            data.hasOwnProperty('latitude') &&
            data.hasOwnProperty('longitude')
          ) {
            location.latitude = data.latitude;
            location.longitude = data.longitude;
          }
        });
      })
      .catch((err) => console.log(err));
  };

  const geocodeVotingLocations = async (electionData) => {
    // make an array of all the locs
    const allLocations = [];
    // handle the possibility that there may not be any pollingLocations
    if (!electionData.pollingLocations) {
      electionData.pollingLocations = [];
    }

    // handle the possibility that there may not be any earlyVoteSites
    if (!electionData.earlyVoteSites) {
      electionData.earlyVoteSites = [];
    }

    // handle the possibility that there may not be any earlyVoteSites
    if (!electionData.dropOffLocations) {
      electionData.dropOffLocations = [];
    }

    // push all subarrays into the all locations array
    allLocations.push(...electionData.pollingLocations);
    allLocations.push(...electionData.earlyVoteSites);
    allLocations.push(...electionData.dropOffLocations);

    // geocode all the locations
    await geoCodeSubArray(allLocations);

    // return the election data with all the long/lat coordinates added
    return electionData;
  };

  const electionPipeline = async () => {
    // get the matching election Id for the next election based on the user address in the request query
    const electionId = await getElectionId();
    if (!electionId) {
      return `No upcoming Elections for ${userLocation.address}.`;
    }
    // then get the matching election data for that election id
    const electionData = await getElectionData(electionId);
    // then geocode the locations for polling, drop-off for ballots, and early voting
    const dataWithGeocoding = await geocodeVotingLocations(electionData);
    // then add the userLocation data onto the object
    dataWithGeocoding.userLocation = userLocation;
    res.locals.electionData = dataWithGeocoding;
    // then log to show that the whole thing was successful
  };

  // now we can use the variable 'electionData' to pick out what we want to send to the front end

  // invoking our election pipeline
  (async () => {
    try {
      await electionPipeline();
      next();
    } catch (err) {
      console.log('This Error occurred :: ', err);
      next(err);
    }
  })();
};

module.exports = controller;
