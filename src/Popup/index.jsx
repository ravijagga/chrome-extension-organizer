import React from 'react';
require('purecss');
import './Popup.scss';
import Categories from './Categories/index.jsx';
import AddCategory from './AddCategory/index.jsx';

import {
	getMergedExtensionsCategories,
	addNewCategoryInStorage,
	moveExtension,
	updateExtensionStatus,
	updateGroups,
	getExtensionsCategoryMapping
} from '../commonFunctions';

class Popup extends React.Component {
	state = { extensions: [], mergedExtensionCategories: [] };
	componentDidMount() {
		getExtensionsCategoryMapping().then(
			categories =>
				!!categories.length &&
				updateGroups(categories).then(() => this.setMergedExtensionsCategoriesInState())
		);
	}

	setMergedExtensionsCategoriesInState = () => {
		return getMergedExtensionsCategories().then(mergedExtensionCategories => {
			console.log('mergedExtensionCategories: ', mergedExtensionCategories);
			return this.setState({ mergedExtensionCategories });
		});
	};

	addNewCategory = newCategoryName => {
		return addNewCategoryInStorage(newCategoryName).then(categoriesMapping => {
			return this.setMergedExtensionsCategoriesInState();
		});
	};

	updateExtensionStatus = (extensionId, enabled) =>
		updateExtensionStatus(extensionId, enabled).then(() =>
			this.setMergedExtensionsCategoriesInState()
		);

	moveExtensionWrapper = (fromCategoryId, toCategoryId, extensionId) =>
		moveExtension(fromCategoryId, toCategoryId, extensionId).then(() =>
			this.setMergedExtensionsCategoriesInState()
		);

	render() {
		const { mergedExtensionCategories } = this.state;
		return (
			<React.Fragment>
				<AddCategory addNewCategory={this.addNewCategory} />
				<Categories
					mergedExtensionCategories={mergedExtensionCategories}
					updateExtensionStatus={this.updateExtensionStatus}
					moveExtensionWrapper={this.moveExtensionWrapper}
				/>
			</React.Fragment>
		);
	}
}

export default Popup;
