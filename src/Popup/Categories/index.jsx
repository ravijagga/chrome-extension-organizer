import React from 'react';
import Extensions from './Extensions/index.jsx';

const Categories = ({ mergedExtensionCategories, ...restProps }) => {
	return (
		<React.Fragment>
			{mergedExtensionCategories.map(category => {
				const { id, name, extensions } = category;

				return (
					<section key={id} id={id}>
						<header>{name}</header>
						<Extensions categoryId={id} extensions={category.extensions} {...restProps} />
					</section>
				);
			})}
		</React.Fragment>
	);
};

export default Categories;
