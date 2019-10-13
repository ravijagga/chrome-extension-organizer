import uuid from 'uuid';
import config from './config';

export const getAllExtensions = () => {
	return new Promise((resolve, reject) => {
		chrome.management.getAll(extensionsAndApps => {
			chrome.management.getSelf(selfExtension => {
				const extensions = extensionsAndApps.filter(
					extension => !extension.isApp && extension.id !== selfExtension.id
				);

				return resolve(extensions);
			});
		});
	});
};

export const getExtensionsCategoryMapping = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(config.STORAGE_KEY, function(result) {
			return result[config.STORAGE_KEY]
				? resolve(result[config.STORAGE_KEY])
				: reject(new Error('Extensions Category Mapping Not found'));
		});
	});
};

export const getMergedExtensionsCategories = () => {
	return Promise.all([getAllExtensions(), getExtensionsCategoryMapping()]).then(
		([allExtensions, extensionsCategoryMapping]) => {
			function mergeExtension(extension) {
				const chromeExtension = allExtensions.find(chromeExt => chromeExt.id === extension.id);

				return {
					...extension,
					enabled: chromeExtension.enabled,
					iconUrl:
						(chromeExtension.icons && chromeExtension.icons[0] && chromeExtension.icons[0].url) ||
						''
				};
			}

			function updateCategory(category) {
				return {
					...category,
					extensions: category.extensions.map(mergeExtension)
				};
			}

			return extensionsCategoryMapping.map(updateCategory);
		}
	);
};

export const setExtensionsCategoryMapping = groups => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.set({ [config.STORAGE_KEY]: groups }, function() {
			return resolve(groups);
		});
	});
};

export const addNewCategoryInStorage = categoryName => {
	categoryName = categoryName.trim();

	return getExtensionsCategoryMapping().then(extensionsCategoryMapping => {
		const existingCategory = extensionsCategoryMapping.find(
			category => category.name.toLowerCase() === categoryName.toLowerCase()
		);

		if (existingCategory) throw new Error('Category Name already exist');

		const newCategoryMapping = { extensions: [], name: categoryName, id: uuid() };
		extensionsCategoryMapping.unshift(newCategoryMapping);

		return setExtensionsCategoryMapping(extensionsCategoryMapping);
	});
};

export const deleteCategoryById = categoryId => {
	return getExtensionsCategoryMapping().then(categories => {
		const categoryIndex = categories.findIndex(category => category.id === categoryId);

		// Push extensions in uncategorized group
		const uncategorised = categories[categories.length - 1];
		uncategorised.extensions = uncategorised.extensions.concat(
			categories[categoryIndex].extensions
		);

		// delete category
		categories.splice(categoryIndex, 1);

		return setExtensionsCategoryMapping(categories);
	});
};

export const moveExtension = (
	fromCategoryId,
	toCategoryId,
	extensionId,
	sourceIndex,
	destinationIndex
) => {
	return getExtensionsCategoryMapping().then(extensionsCategoryMapping => {
		function getCategoryById(id) {
			return extensionsCategoryMapping.find(category => category.id === id);
		}

		if (fromCategoryId !== toCategoryId) {
			const sourceCategory = getCategoryById(fromCategoryId);
			const targetCategory = getCategoryById(toCategoryId);

			const sourceExtension = sourceCategory.extensions[sourceIndex];
			const extensionIndexInSourceCategory =
				sourceExtension && sourceExtension.id === extensionId
					? sourceIndex
					: sourceCategory.extensions.findIndex(extension => extension.id === extensionId);

			targetCategory.extensions.splice(
				destinationIndex,
				0,
				sourceCategory.extensions[extensionIndexInSourceCategory]
			);

			sourceCategory.extensions.splice(extensionIndexInSourceCategory, 1);

			return setExtensionsCategoryMapping(extensionsCategoryMapping);
		} else if (sourceIndex !== destinationIndex) {
			const category = getCategoryById(fromCategoryId);

			category.extensions.splice(
				destinationIndex,
				0,
				category.extensions.splice(sourceIndex, 1)[0]
			);

			return setExtensionsCategoryMapping(extensionsCategoryMapping);
		}
	});
};

export const updateExtensionStatus = (extensionId, enabled) =>
	new Promise(resolve => chrome.management.setEnabled(extensionId, enabled, () => resolve()));

export const resetGroups = () => {
	return getAllExtensions().then(extensions => {
		const groups = [
			{
				name: config.UNCATEGORIZED_SECTION_NAME,
				id: uuid(),
				extensions: extensions.map(({ name, id }) => ({ name, id }))
			}
		];

		return setExtensionsCategoryMapping(groups);
	});
};

export const updateGroups = existingGroups => {
	return getAllExtensions().then(extensions => {
		const notFoundExtensions = [...extensions];

		const updatedGroups = existingGroups.map(group => {
			// remove not found extensions from all groups
			const updatedGroup = {
				...group,
				extensions: group.extensions.filter(groupExtension => {
					const extensionPosition = notFoundExtensions.findIndex(
						extension => extension.id === groupExtension.id
					);

					return extensionPosition > -1 && !!notFoundExtensions.splice(extensionPosition, 1).length;
				})
			};

			// add new extensions in uncategorised group
			if (group.name === config.UNCATEGORIZED_SECTION_NAME && notFoundExtensions.length) {
				updatedGroup.extensions = [...updatedGroup.extensions, ...notFoundExtensions];
			}

			return updatedGroup;
		});

		return setExtensionsCategoryMapping(updatedGroups);
	});
};
