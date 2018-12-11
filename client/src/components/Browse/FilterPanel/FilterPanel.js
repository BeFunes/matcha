import React, {Component} from 'react';
import styles from './FilterPanel.module.css'
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

class FilterPanel extends Component {
	state = {
		ageMin: 18,
		ageMax: 99

	}

	componentDidMount() {
		this.setState({...this.props.filters})
	}

	ageRangeHandler = ([min, max]) => {
		this.setState({ageMin: min, ageMax: max})
	}

	render() {
		const filters = {
			ageMin: this.state.ageMin,
			ageMax: this.state.ageMax
		}
		return (
			<div className={styles.component}>
				<header className={styles.header}> FILTERS</header>
				<div className={styles.ageRange}>
					<div className={styles.label}>Age range</div>
					<Range
						min={18}
						max={99}
						marks={{[this.state.ageMin]: this.state.ageMin, [this.state.ageMax]: this.state.ageMax}}
						allowCross={false}
						onChange={this.ageRangeHandler}
						trackStyle={[{backgroundColor: '#DD0E52'}]}
						onAfterChange={this.props.onFilterChange.bind(this, filters)}
						railStyle={{backgroundColor: '#aeaeae'}}
						value={[this.state.ageMin, this.state.ageMax]}
					/>
				</div>
			</div>
		)
	}
}

export default FilterPanel
