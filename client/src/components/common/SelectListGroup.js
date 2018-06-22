import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const SelectListGroup = ({
  name,
  id,
  label,
  value,
  error,
  info,
  onChange,
  options
}) => {
  const selectOptions = options.map(option => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));

  const select = (
    <select
      className={classnames("form-control", {
        "is-invalid": error
      })}
      name={name}
      value={value}
      onChange={onChange}
    >
      {selectOptions}
    </select>
  );
  if (label)
    return (
      <div className="form-group row">
        <label htmlFor={label} className="col-md-2 col-form-label">
          {label}
        </label>
        <div className="col-md-10">
          {select}
          {info && <small className="form-text text-muted">{info}</small>}
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      </div>
    );
  else
    return (
      <div className="form-group">
        {select}
        {info && <small className="form-text text-muted">{info}</small>}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    );
};

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};

export default SelectListGroup;
