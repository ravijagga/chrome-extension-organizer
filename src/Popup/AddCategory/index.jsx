import React from 'react';
import './AddCategory.scss';
class AddCategory extends React.Component {
	state = { newCategoryName: '', error: '' };

	onChange = ({ target: { value, name } }) => {
		this.setState({ [name]: value });
	};

	onSubmit = e => {
		e.preventDefault();
		const { addNewCategory } = this.props;
		const { newCategoryName } = this.state;
		const categoryNamePattern = /^([\w]+[ ]{0,1})+$/;

		if (!categoryNamePattern.test(newCategoryName)) {
			return this.setState({
				error:
					'Category Name is invalid. Only Alpha-Numeric, whitespaces and underscore (_) are allowed'
			});
		}

		addNewCategory(newCategoryName)
			.then(() => this.setState({ newCategoryName: '' }))
			.catch(err => this.setState({ error: err.message }));
	};

	render() {
		const { newCategoryName, error } = this.state;
		return (
			<section className="new-cat">
				<form class="pure-form" onSubmit={this.onSubmit}>
					<fieldset>
						<input
							type="text"
							className="pure-input-1"
							value={newCategoryName}
							name="newCategoryName"
							onChange={this.onChange}
							placeholder="Category Name"
						/>
						<button type="submit" class="pure-button">
							Add Category
						</button>
						<span>{error}</span>
					</fieldset>
				</form>
			</section>
		);
	}
}

export default AddCategory;
