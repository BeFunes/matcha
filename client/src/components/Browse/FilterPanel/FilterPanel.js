import React, {Component} from 'react';
import styles from './FilterPanel.module.css'
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import Select from "@material-ui/core/es/Select/Select";
import OutlinedInput from "@material-ui/core/es/OutlinedInput/OutlinedInput";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";

class FilterPanel extends Component {
	state = {
		filters: {
			ageMin: 18,
			ageMax: 99
		},
		sortValue: 'location'
	}

	componentDidMount() {
		this.setState({filters: {...this.props.filters}})
	}

	ageRangeHandler = ([min, max]) => {
		this.setState({filters: {ageMin: min, ageMax: max}})
	}

	sortingChangeHandler = ({target}) => {
		this.setState({ sortValue: target.value })
		this.props.onSortChange(target.value)
	}

	render() {
		const filters = {
			ageMin: this.state.filters.ageMin,
			ageMax: this.state.filters.ageMax
		}
		return (
			<div className={styles.component}>
				<div className={styles.filterBox}>
				<header className={styles.header}> FILTERS</header>
				<div className={styles.ageRange}>
					<div className={styles.label}>Age range</div>
					<Range
						min={18}
						max={99}
						marks={{[filters.ageMin]: filters.ageMin, [filters.ageMax]: filters.ageMax}}
						allowCross={false}
						onChange={this.ageRangeHandler}
						trackStyle={[{backgroundColor: '#DD0E52'}]}
						onAfterChange={this.props.onFilterChange.bind(this, filters)}
						railStyle={{backgroundColor: '#aeaeae'}}
						value={[filters.ageMin, filters.ageMax]}
					/>
				</div>
				</div>
				<div className={styles.sortingBox}>
				<header className={styles.header}> SORT BY </header>


				<FormControl variant="outlined" >

					<Select
						value={this.state.sortValue}
						onChange={this.sortingChangeHandler}
						input={
							<OutlinedInput
								labelWidth={0}
								name="age"
							/>
						}
					>
						<MenuItem value="location">Distance</MenuItem>
						<MenuItem value="age<">Age <em>&nbsp;(youger to older)</em></MenuItem>
						<MenuItem value="age>">Age <em>&nbsp;(older to younger)</em></MenuItem>
						<MenuItem value="interests">Interests in common</MenuItem>
					</Select>
				</FormControl>
				</div>
			</div>
		)
	}
}

export default FilterPanel
