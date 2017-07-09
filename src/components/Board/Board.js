import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import s from './Board.css';
import CardsContainer from '../CardsContainer';
import * as ListsActions from '../../actions/lists';
import CustomDragLayer from './CustomDragLayer';

function mapStateToProps(state) {
  return {
    lists: state.lists.lists,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ListsActions, dispatch);
}

class Board extends React.Component {

  static propTypes = {
    getLists: PropTypes.func.isRequired,
    lists: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.moveList = this.moveList.bind(this);
    this.findList = this.findList.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.stopScrolling = this.stopScrolling.bind(this);
    this.startScrolling = this.startScrolling.bind(this);
    this.state = { isScrolling: false };
  }

  startScrolling(direction) {
    // if (!this.state.isScrolling) {
    switch (direction) {
      case 'toLeft':
        this.setState({ isScrolling: true }, this.scrollLeft());
        break;
      case 'toRight':
        this.setState({ isScrolling: true }, this.scrollRight());
        break;
      default:
        break;
    }
    // }
  }

  scrollRight() {
    function scroll() {
      document.getElementById('KanbanLayout').scrollLeft += 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  scrollLeft() {
    function scroll() {
      document.getElementById('KanbanLayout').scrollLeft -= 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  stopScrolling() {
    this.setState({ isScrolling: false }, clearInterval(this.scrollInterval));
  }

  moveCard(lastX, lastY, nextX, nextY) {
    this.props.moveCard(lastX, lastY, nextX, nextY);
  }

  moveList(listId, nextX) {
    const { lastX } = this.findList(listId);
    this.props.moveList(lastX, nextX);
  }

  findList(id) {
    const { lists } = this.props;
    const list = lists.filter(l => l.id === id)[0];

    return {
      list,
      lastX: lists.indexOf(list)
    };
  }

  componentWillMount() {
    this.props.getLists(3);
  }

  render() {
    const { lists } = this.props;
    return (
      <div className={s.root}>
        <CustomDragLayer snapToGrid={false} />
        {lists.map((item, i) =>
          <CardsContainer
            key={item.id}
            id={item.id}
            item={item}
            moveCard={this.moveCard}
            moveList={this.moveList}
            startScrolling={this.startScrolling}
            stopScrolling={this.stopScrolling}
            isScrolling={this.state.isScrolling}
            x={i}
          />
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(withStyles(s)(Board)));