import React from 'react';
import config from '../../config';
import './AddCategory.scss';
class AddCategory extends React.Component {
	state = { newCategoryName: '', error: '' };

	isCategoryNameValid = categoryName => config.CATEGORY_NAME_REGEX.test(categoryName);

	onChange = ({ target: { value, name } }) =>
		this.setState({
			[name]: value,
			error: !this.isCategoryNameValid(value) && value ? config.CATEGORY_NAME_ERR_MSG : ''
		});

	onSubmit = e => {
		e.preventDefault();
		const { addNewCategory } = this.props;
		const { newCategoryName } = this.state;

		if (!this.isCategoryNameValid(newCategoryName)) {
			return this.setState({
				error: config.CATEGORY_NAME_ERR_MSG
			});
		}

		addNewCategory(newCategoryName)
			.then(() => this.setState({ newCategoryName: '', error: '' }))
			.catch(err => this.setState({ error: err.message }));
	};

	render() {
		const { newCategoryName, error } = this.state;
		return (
			<section className="new-cat">
				<form className="pure-form" onSubmit={this.onSubmit}>
					<fieldset>
						<input
							type="text"
							className="pure-input-1"
							value={newCategoryName}
							name="newCategoryName"
							onChange={this.onChange}
							placeholder="Category Name"
						/>
						<span className="error">{error}</span>
						<button type="submit" className="pure-button">
							Add Category
						</button>
					</fieldset>
				</form>
			</section>
		);
	}
}

export default AddCategory;
