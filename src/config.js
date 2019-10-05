export default {
	STORAGE_KEY: 'rj_ext_groups',
	RESET_CATEGORY_MAPPING: false,
	CATEGORY_NAME_REGEX: /^([\w]+[ ]{0,1})+$/,
	CATEGORY_NAME_ERR_MSG:
		'Category Name is invalid. Only Alpha-Numeric, whitespaces and underscore (_) are allowed',
	CATEGORY_DELETE_WARNING_MSG:
		'This category will be deleted permanently. All extensions inside this category will be moved to Uncategorized section.'
};
