import React from 'react';
import {connect} from "react-redux";
import {ReactComponent as TileMenuIcon} from "../YearView/assets/tile-menu.svg";
import {ReactComponent as ArrowTop} from "../MonthView/assets/arrow-top.svg";
import {ReactComponent as ArrowBottom} from "../MonthView/assets/arrow-bottom.svg";
import {setMonth, setYear} from "../YearView/actions";
import {setDay} from "../MonthView/actions";
import {MONTHS, MIN_SWIPE} from '../../constants';
import './styles.scss';

class MonthView extends React.Component {
    constructor(props){
        super(props);
        this.class = 'month-view';
        this.touchCoordinates = {
            startY: null,
            endY: null,
        };
        this.date = new Date(Date.UTC(props.year, props.month, 1));

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.showPrevMonth = this.showPrevMonth.bind(this);
        this.showNextMonth = this.showNextMonth.bind(this);
    }

    get days(){
        const days = [];
        const monthColor = MONTHS[this.props.month].color;

        for(let i=0; i < new Date(this.props.year, this.props.month).getUTCDay(); i++ ){
            days.push(<div className={`${this.class}__day-wrapper`} key={`key-${i}`}/>);
        }
        for(let i=1; i <= new Date(this.props.year, this.props.month + 1, 0).getDate(); i++ ){
            const isSelected = this.props.day === i ? `${this.class}__day--selected` : '';
            const selectedClassName = this.props.day === i ? `${this.class}__day--selected` : '';
            const selectedDayStyles = isSelected ? {
                    borderColor: monthColor,
                    color: monthColor,
                } : {animationDelay: `${.01 * i}s`};

            days.push(<div className={`${this.class}__day-wrapper`} key={i}>
                <div className={`${this.class}__day ${selectedClassName}`} style={selectedDayStyles}
                     onClick={()=>{this.props.setDay(i)}}>
                    {i}
                </div>
            </div>);
        }

        return days;
    }

    onTouchStart(e) {
        this.touchCoordinates.startY = e.touches[0].clientY;
        this.touchCoordinates.endY = e.touches[0].clientY;
    }

    onTouchMove(e) {
        this.touchCoordinates.endY = e.touches[0].clientY;
    }

    onTouchEnd() {
        const startY = this.touchCoordinates.startY;
        const endY = this.touchCoordinates.endY;

        if (startY > endY && startY - endY > MIN_SWIPE) {
            this.showNextMonth();
        } else if (Math.abs(endY - startY) > MIN_SWIPE) {
            this.showPrevMonth();
        }
    }

    showNextMonth(){
        this.date.setUTCMonth(this.date.getUTCMonth() + 1);
        this.props.setMonth(this.date.getUTCMonth());
        this.props.setYear(this.date.getUTCFullYear());
    }

    showPrevMonth(){
        this.date.setUTCMonth(this.date.getUTCMonth() - 1);
        this.props.setMonth(this.date.getUTCMonth());
        this.props.setYear(this.date.getUTCFullYear());
    }

    render(){
        const monthColor = MONTHS[this.props.month].color;

        return <section className={`${this.class}`}>
            <TileMenuIcon className={`${this.class}__btn ${this.class}__btn--back`}
            onClick={this.props.resetMonth}/>
            <div className={`${this.class}__title`} style={{color: monthColor}}>
                {MONTHS[this.props.month].name.full}
            </div>
            <div className={`${this.class}__body`}>
                <div className={`${this.class}__data-wrapper`} style={{backgroundColor: monthColor}}>
                    {this.props.day && <h2 className={`${this.class}__title-date`}>
                        {`${this.props.day}/${this.props.month + 1}/${this.props.year}`}
                    </h2>}
                </div>
                <div className={`${this.class}__month-wrapper`}
                     onTouchStart={this.onTouchStart}
                     onTouchMove={this.onTouchMove}
                     onTouchEnd={this.onTouchEnd}
                >
                    <ArrowTop
                        className={`${this.class}__btn ${this.class}__btn--arrow`}
                        onClick={this.showPrevMonth}
                    />
                    <div className={`${this.class}__days-wrapper`}>
                        {this.days}
                    </div>
                    <ArrowBottom
                        className={`${this.class}__btn ${this.class}__btn--arrow`}
                        onClick={this.showNextMonth}
                    />
                </div>
            </div>
        </section>
    }
}

function mapStateToProps(state) {
    return {
        year: state.yearViewReducer.year,
        month: state.yearViewReducer.month,
        day: state.monthViewReducer.day,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setDay: (day) => dispatch(setDay(day)),
        setMonth: (month) => dispatch(setMonth(month)),
        setYear: (year) => dispatch(setYear(year)),
        resetMonth: () => dispatch(setMonth('')),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthView);