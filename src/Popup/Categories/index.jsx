import React from 'react';
import './Categories.scss';
import Extensions from './Extensions/index.jsx';

const Categories = ({ mergedExtensionCategories, ...restProps }) => {
	return (
		<React.Fragment>
			{mergedExtensionCategories.map(category => {
				const { id, name, extensions } = category;

				return (
					<section className="category" key={id} id={id}>
						<h3>{name}</h3>
						<Extensions categoryId={id} extensions={category.extensions} {...restProps} />
					</section>
				);
			})}
		</React.Fragment>
	);
};

export default Categories;
