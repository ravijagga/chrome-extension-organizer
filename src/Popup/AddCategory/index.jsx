import React from 'react';

class AddCategory extends React.Component {
	state = { newCategoryName: '' };

	onChange = ({ target: { value, name } }) => {
		this.setState({ [name]: value });
	};

	onSubmit = e => {
		e.preventDefault();
		const { addNewCategory } = this.props;
		const { newCategoryName } = this.state;

		addNewCategory(newCategoryName).then(() => this.setState({ newCategoryName: '' }));
	};

	render() {
		const { newCategoryName } = this.state;
		return (
			<section>
				<h3>Add New Category</h3>
				<form onSubmit={this.onSubmit}>
					<input
						type="text"
						value={newCategoryName}
						name="newCategoryName"
						onChange={this.onChange}
					/>
					<button type="submit">Add Category</button>
				</form>
			</section>
		);
	}
}

export default AddCategory;
