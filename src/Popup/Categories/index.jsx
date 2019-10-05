import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import './Categories.scss';
import Extensions from './Extensions/index.jsx';
import config from '../../config';

const Categories = ({
	mergedExtensionCategories,
	moveExtensionWrapper,
	deleteCategory,
	...restProps
}) => {
	const onDragEnd = ({
		source: { droppableId: fromCategoryId, index: sourceIndex },
		destination,
		draggableId: extensionId
	}) => {
		if (!destination) return;

		const { droppableId: toCategoryId, index: destinationIndex } = destination;
		return moveExtensionWrapper(
			fromCategoryId,
			toCategoryId,
			extensionId,
			sourceIndex,
			destinationIndex
		);
	};

	const deleteCategoryWrap = categoryId => {
		const confirmed = window.confirm(config.CATEGORY_DELETE_WARNING_MSG);
		if (!confirmed) return;

		return deleteCategory(categoryId);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			{mergedExtensionCategories.map((category, index) => {
				const { id, name, extensions } = category;

				return (
					<section className="category" key={id} id={id}>
						<header>
							<h3>{name}</h3>
							{mergedExtensionCategories.length - 1 !== index && (
								<span className="del-cat" title="Delete Category" onClick={deleteCategoryWrap.bind(null, id)}>
									&times;
								</span>
							)}
						</header>
						<Extensions categoryId={id} extensions={category.extensions} {...restProps} />
					</section>
				);
			})}
		</DragDropContext>
	);
};

export default Categories;
