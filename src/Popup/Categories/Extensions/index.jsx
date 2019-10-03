import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './Extensions.scss';
import CheckBox from '../../../Shared/CheckBox/index.jsx';

const Extensions = ({ categoryId, extensions, updateExtensionStatus, moveExtensionWrapper }) => {
	const handleCheckBox = ({
		target: {
			dataset: { extensionId },
			checked
		}
	}) => updateExtensionStatus(extensionId, checked);

	const getEmptyListStyle = isDraggingOver => ({
		borderColor: isDraggingOver ? '#ccc' : '#e6e6e6',
		padding: isDraggingOver ? '15px 10px' : '10px',
		color: isDraggingOver ? 'transparent' : '#999'
	});

	return (
		<Droppable droppableId={categoryId}>
			{(provided, snapshot) => (
				<ul className="extensions" ref={provided.innerRef}>
					{!!extensions.length &&
						extensions.map((extension, index) => {
							const { id, name, enabled, iconUrl } = extension;
							return (
								<Draggable key={id} draggableId={id} index={index}>
									{(provided, snapshot) => (
										<li
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<label
												htmlFor={`checkbox-${id}`}
												className="pure-checkbox"
												title={name.length >= 33 ? name : ''}
											>
												<CheckBox
													id={`checkbox-${id}`}
													name={name}
													checked={enabled}
													data-extension-id={id}
													onChange={handleCheckBox}
												/>
												{!!iconUrl && <img src={iconUrl} alt={name} />}
												{name}
											</label>
											{provided.placeholder}
										</li>
									)}
								</Draggable>
							);
						})}

					{!extensions.length && (
						<div id="empty" style={getEmptyListStyle(snapshot.isDraggingOver)}>
							Drag and Drop extensions here
						</div>
					)}

					{!!extensions.length && provided.placeholder}
				</ul>
			)}
		</Droppable>
	);
};

export default Extensions;
