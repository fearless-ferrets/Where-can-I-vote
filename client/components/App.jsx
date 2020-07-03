import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

// Components
import Layout from './Layout/Layout';
import AddressComponent from './address-search/address-search';
import CivicSummaryComponent from './civic-summary/civic-summary';
import Map from './Map/Map';
import SignUpForm from './forms/sign-up';
import LogInForm from './forms/log-in';

const App = () => {
  const [votingInfo, setVotingInfo] = useState(null);
  const [error, setError] = useState(null);
  useEffect(()=>{
    console.log(`State is now ${JSON.stringify(votingInfo)}`)
  }, [votingInfo])

  const handleOnSubmit = async (addressData) => {
    console.log(`Submitting address data ${JSON.stringify(addressData)}`);
    // first get the user location and render the map
    // set
    setVotingInfo({
      userLocation:{
        lat: addressData.latitude,
        long: addressData.longitude,
        address: addressData.address,
      },
    });

    try {
      console.log("Now sending request")
      const res = await axios
        .get('/api', {
          params: {
            lat: addressData.latitude,
            long: addressData.longitude,
            address: addressData.address,
          },
        })
      console.log(`res.data -->`, res.data);
      setVotingInfo(res.data);
    } catch (error) {
      setError(e.response.data);
    }
    
  };

  // these are like the "pages" in our app

  // this one currently handles the initial address form and returned summary and map for elections
  function Home() {
    return (
      <div>
        {votingInfo && votingInfo.election ? (
          <>
            <CivicSummaryComponent votingInfo={votingInfo} />
            <Map mapData={votingInfo} />
          </>
        ) : (
          <AddressComponent onSubmit={handleOnSubmit} error={error} />
        )}
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        {/* Anything goes in here will be centered both vertically and horizontally
      since the Layout Component has display of flex. */}
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/sign-up">
            <SignUpForm />
          </Route>
          <Route exact path="/log-in">
            <LogInForm />
          </Route>
          <Route exact path="/note">
            {/* Put Note to our Users component here */}
          </Route>
          <Route exact path="/about">
            {/* Put About component here */}
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
