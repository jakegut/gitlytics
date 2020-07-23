import React, {useState} from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Paper, Typography, Button } from '@material-ui/core';

const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}-${new Date().getTime()}`,
        content: `item ${k + offset}`
}));

const reorder = (list, startIndex, endIndex) => {
    if(list.length == 1) return list

    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
  
    destClone.splice(droppableDestination.index, 0, removed);
  
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
  
    return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
  
    // change background colour if dragging
    background: isDragging ?? "lightgreen",
  
    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "none",
    padding: grid,
    margin: grid,
    minWidth: 200
});

export default function GroupDnd(props){
    const {items, setItems} = props;
    // const [items, setItems] = useState([getItems(10), getItems(5, 10)]);

    function onDragEnd(result) {
        const { source, destination } = result;
    
        // dropped outside the list
        if (!destination) {
          return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;
    
        if (sInd === dInd) {
          const its = reorder(items[sInd], source.index, destination.index);
          const newState = [...items];
          newState[sInd] = its;
          setItems(newState);
        } else {
          const result = move(items[sInd], items[dInd], source, destination);
          const newState = [...items];
          newState[sInd] = result[sInd];
          newState[dInd] = result[dInd];
    
          setItems(newState.filter((group, i) => i === 0 || group.length));
        }
      }

    return (
<div style={{minWidth: "100%"}}>
      <Typography variant="h5">
        Group Assignments
      </Typography>
      <Button
        type="button"
        onClick={() => {
          setItems([...items, []]);
        }}
      >
        Add new group
      </Button>
      <div style={{ display: "flex", overflow: "auto", maxWidth: "100%" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {items.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <Paper
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                    {ind ? `Group ${ind}` : `Students`}
                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={`${item.id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around"
                            }}
                          >
                            <Typography>{item.username}</Typography>
                            {/* <button
                              type="button"
                              onClick={() => {
                                const newState = [...state];
                                newState[ind].splice(index, 1);
                                setState(
                                  newState.filter(group => group.length)
                                );
                              }}
                            >
                              delete
                            </button> */}
                          </div>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
    )
}
