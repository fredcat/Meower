import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  const input = (
    <input
      type={type}
      className={classnames("form-control", {
        "is-invalid": error
      })}
      placeholder={placeholder}
      name={name}
      value={value}
      id={label}
      onChange={onChange}
      disabled={disabled}
    />
  );

  if (label)
    return (
      <div className="form-group row">
        <label htmlFor={label} className="col-md-2 col-form-label">
          {label}
        </label>
        <div className="col-md-10">
          {input}
          {info && <small className="form-text text-muted">{info}</small>}
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      </div>
    );
  else
    return (
      <div className="form-group">
        {input}
        {info && <small className="form-text text-muted">{info}</small>}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    );
};

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: "text"
};

export default TextFieldGroup;
