import React, { useState } from 'react';
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

  const handleOnSubmit = (addressData) => {
    axios
      .get('/api', {
        params: {
          lat: addressData.latitude,
          long: addressData.longitude,
          address: addressData.address,
        },
      })
      .then(({ data }) => {
        setVotingInfo(data);
      })
      .catch((e) => {
        setError(e.response.data);
      });
  };

  // these are like the "pages" in our app

  // this one currently handles the initial address form and returned summary and map for elections
  function Home() {
    return (
      <div>
        {votingInfo ? (
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
