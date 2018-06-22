import React from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

const THREEDAYS = 3 * 24 * 60 * 60 * 1000;

const TimeDisplay = props => {
  const dateString = props.children;

  let timeformat;
  let fromNow = false;

  const timediff = new Date() - new Date(dateString);
  if (timediff <= THREEDAYS) {
    fromNow = true;
    timeformat = null;
  } else if (new Date().getFullYear() === new Date(dateString).getFullYear()) {
    timeformat = "MMM D [at] h:mm A";
  } else {
    timeformat = "MMM D, YYYY";
  }

  return (
    <Moment format={timeformat} fromNow={fromNow}>
      {dateString}
    </Moment>
  );
};

TimeDisplay.propTypes = {
  children: PropTypes.node.isRequired
};

export default TimeDisplay;
