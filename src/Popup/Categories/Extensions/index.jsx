import React from 'react';

const Extensions = ({ categoryId, extensions, updateExtensionStatus, moveExtensionWrapper }) => {
	const handleCheckBox = ({
		target: {
			dataset: { extensionId },
			checked
		}
	}) => updateExtensionStatus(extensionId, checked);

	const html = document.scrollingElement;
	let stopScroll = true;
	let prevScroll;

	const handleDragOver = e => {
		e.preventDefault();

		stopScroll = true;

		if (e.clientY < 200) {
			stopScroll = false;
			scroll(-1 * 0.5, e.clientY);
		}

		if (e.clientY > html.clientHeight - 200) {
			stopScroll = false;
			scroll(1 * 0.5, e.clientY);
		}
	};

	const handleDrag = e => {
		e.dataTransfer.setData('extensionId', e.target.dataset.extensionId);
		e.dataTransfer.setData('fromCategoryId', e.target.parentNode.dataset.categoryId);
	};

	const handleDrop = e => {
		e.preventDefault();

		let el = e.target;
		console.log('el: ', el);

		if (el.tagName !== 'UL') {
			el = el.closest('UL');
		}

		const { categoryId: toCategoryId } = el.dataset;
		const fromCategoryId = e.dataTransfer.getData('fromCategoryId');
		const extensionId = e.dataTransfer.getData('extensionId');

		moveExtensionWrapper(fromCategoryId, toCategoryId, extensionId);
	};

	const handleDragEnd = e => {
		stopScroll = true;
	};

	const scroll = (step, scrollY) => {
		console.log('scrollY: ', scrollY);
		console.log(step);
		html.scrollTo(0, scrollY + step);
		if (!stop) {
			setTimeout(function() {
				scroll(step);
			}, 20);
		}
	};

	return (
		<ul data-category-id={categoryId} onDrop={handleDrop} onDragOver={handleDragOver}>
			{!!extensions.length &&
				extensions.map(extension => {
					const { id, name, enabled } = extension;
					return (
						<li
							key={id}
							data-extension-id={id}
							id={id}
							draggable
							onDragStart={handleDrag}
							onDragEnd={handleDragEnd}
						>
							<input
								type="checkbox"
								data-extension-id={id}
								id={`checkbox-${id}`}
								name={name}
								checked={enabled}
								onChange={handleCheckBox}
							/>
							<label htmlFor={`checkbox-${id}`}>{name}</label>
						</li>
					);
				})}

			{!extensions.length && (
				<li id="empty" style={{ border: '1px dashed #ccc', padding: '10px' }}>
					Drag and Drop extensions here
				</li>
			)}
		</ul>
	);
};

export default Extensions;
