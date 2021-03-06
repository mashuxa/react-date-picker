import React from "react";
import YearView from "../YearView";
import MonthView from "../MonthView";
import {connect} from "react-redux";
import {setDate} from "../../actions";
import {ROOT_CLASS, MONTHS} from "../../constants";
import './styles/style.scss';

class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    props.store && typeof props.onChange === 'function' && props.store.subscribe(() => {
      props.onChange(props.store.getState().datePickerReducer);
    });
  }

  componentDidMount() {
    const initialDate = this.props.initialDate;

    if (initialDate) {
      const errorMsg = 'Incorrect date format. Use Date object or string in format "year-month-day"';

      if (initialDate instanceof Date) {
        this.props.setDate({
          day: initialDate.getUTCDate(),
          month: initialDate.getUTCMonth(),
          year: initialDate.getUTCFullYear(),
        });
      } else if (typeof initialDate === 'string') {
        try {
          const [year, month, day] = initialDate.split('-').map(el => Number(el));
          const date = new Date(Date.UTC(year, month - 1, day));

          if (year !== date.getUTCFullYear() || month - 1 !== date.getUTCMonth() || day !== date.getUTCDate()) {
            throw new Error(errorMsg);
          } else {
            this.props.setDate({
              day,
              month: month - 1,
              year,
            });
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        throw new Error(errorMsg);
      }
    }
  }

  render() {
    const {day, month, year} = this.props;

    return <React.Fragment>
      <h2 className={`${ROOT_CLASS}__title`}>
        <span>{this.props.title}: </span>
        <span className={`${ROOT_CLASS}__title-selected-date`}>
          {`${day ? day : '  '} ${month !== '' ? MONTHS[month].name.short : '   '} ${year ? year : '    '}`}
        </span>
      </h2>
      {this.props.month !== '' ? <MonthView data={this.props.data}/> : <YearView/>}
    </React.Fragment>;
  }
}

function mapStateToProps(state) {
  return {
    day: state.datePickerReducer.day,
    month: state.datePickerReducer.month,
    year: state.datePickerReducer.year,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setDate: (date) => dispatch(setDate(date)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DatePicker);
