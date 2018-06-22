import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const TextAreaFieldGroup = ({
  name,
  id,
  label,
  placeholder,
  value,
  error,
  info,
  onChange,
  onFocus,
  onBlur
}) => {
  const input = (
    <textarea
      className={classnames("form-control", {
        "is-invalid": error
      })}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
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

TextAreaFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};

export default TextAreaFieldGroup;
