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
	getExtensionsCategoryMapping,
	deleteCategoryById
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

	setMergedExtensionsCategoriesInState = () =>
		getMergedExtensionsCategories().then(mergedExtensionCategories =>
			this.setState({ mergedExtensionCategories })
		);

	addNewCategory = newCategoryName =>
		addNewCategoryInStorage(newCategoryName).then(categoriesMapping =>
			this.setMergedExtensionsCategoriesInState()
		);

	deleteCategory = categoryId =>
		deleteCategoryById(categoryId).then(() => this.setMergedExtensionsCategoriesInState());

	updateExtensionStatus = (extensionId, enabled) =>
		updateExtensionStatus(extensionId, enabled).then(() =>
			this.setMergedExtensionsCategoriesInState()
		);

	moveExtensionWrapper = (
		fromCategoryId,
		toCategoryId,
		extensionId,
		sourceIndex,
		destinationIndex
	) =>
		moveExtension(fromCategoryId, toCategoryId, extensionId, sourceIndex, destinationIndex).then(
			() => this.setMergedExtensionsCategoriesInState()
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
					deleteCategory={this.deleteCategory}
				/>
			</React.Fragment>
		);
	}
}

export default Popup;
