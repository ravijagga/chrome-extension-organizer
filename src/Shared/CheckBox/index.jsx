import React from 'react';
import './CheckBox.scss';

const CheckBox = props => (
	<label className="checkbox">
		<input type="checkbox" {...props} />
		<span className="checkmark" />
	</label>
);

export default CheckBox;
