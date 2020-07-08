import React from 'react';

import localStyles from './civic-summary.css';

const Electioninfo = ({ payload }) => {
  // payload is an array
  // if array length is 0 then render nothing

  console.log('ElectionINFO', payload);

  let electionAdministrationBody;
  if (payload[0].electionAdministrationBody) {
    electionAdministrationBody = payload[0].electionAdministrationBody;
  }
  return (
    <div className={localStyles.summary__lower}>
      {electionAdministrationBody && (
        <div className={localStyles.summary__links}>
          { Object.keys(electionAdministrationBody).map((key) => {
            return (
              <a href={`${electionAdministrationBody[key]}`} key={key}>
                {key
                  .split(/(?=[A-Z])/)
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

const VoteAssisterInfo = ({ payload }) => {
  console.log('PAYLOAD', payload);
  return (
    <div>
      <h1 id="election-summary-title">Next Election:</h1>
      <h2>{payload.election.name}</h2>
      <span className={localStyles.small}>Mail only state: </span>
      <span>{payload.mailOnly ? <span className={localStyles.green__bold}>Yes</span> : <span className={localStyles.red__bold}>No</span>}</span>
    </div>
  );
};

const CivicSummary = ({ votingInfo }) => {
  console.log('votingInfo', votingInfo);
  const { election, mailOnly, state } = votingInfo;

  return (
    <div className={localStyles.main__banner}>
      <div className={localStyles.summary__upper}>
        <VoteAssisterInfo
          payload={{
            election,
            mailOnly,
          }}
        />
      </div>
      <div className={localStyles.summary__middle}>
        Election Day: <strong>{ election && election.electionDay}</strong>
      </div>
      <Electioninfo payload={state} />
    </div>
  );
};

export default CivicSummary;
