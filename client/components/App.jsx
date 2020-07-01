import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Layout from './Layout/Layout';
import AddressComponent from './address-search/address-search';
import CivicSummaryComponent from './civic-summary/civic-summary';
import Map from './Map/Map';

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
                                  address: addressData.address
                                }
                  }
                );

    try {
      console.log("Now sending request")
      const res = await axios
      .get('/api', {
        params: {
          lat: addressData.latitude,
          long: addressData.longitude,
          address: addressData.address,
          // .replace(/,/g, '')
          // .replace(/ USA$/g, '')
          // .trim(),
        },
      })
      setVotingInfo(res.data);
    } catch (error) {
      setError(e.response.data);
    }
    
  };

  return (
    <Layout>
      {/* Anything goes in here will be centered both vertically and horizontally
      since the Layout Component has display of flex. */}
      {votingInfo ? (
        <>
          <CivicSummaryComponent votingInfo={votingInfo} />
          <Map mapData={votingInfo} />
        </>
      ) : (
        <AddressComponent onSubmit={handleOnSubmit} error={error} />
      )}
    </Layout>
  );
};
export default App;

// import React, { Component } from 'react';
// import Layout from './Layout/Layout.jsx';
// import NavBar from './NavigationBar/NavigationBar.jsx';
// import Footer from './Footer/Footer.jsx';

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.onSubmit = this.onSubmit.bind(this);
//   }
//   onSubmit(event) {
//     event.preventDefault(event);
//     console.log('form submitted');
//   }
//   render() {
//     return (
//       <Layout>
//         <NavBar />

//         <Footer />
//       </Layout>
//     );
//   }
// }
// export default App;
