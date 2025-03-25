
import { useState, useEffect } from "react";
import "./todo.css";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// interface the to item
interface TodoItem {
  todo: string;
  id: number;
}


// the main component
const Todolist = () => {
  const [inputValue, setInputValue] = useState("");
  const [listofitems, setListofitems] = useState<TodoItem[]>([]);
  const [editid, Seteidtid] = useState(-1); // Initialize with -1 (no edit)
  const [editinputvalue, Seteditinputvalue] = useState("");
  const [editinput, Seteditinput] = useState(false);
// retriving from the  local storage
  useEffect(() => {
    retrivingtheitems();
  }, []);

  const retrivingtheitems = () => {
    const data = localStorage.getItem('todos');
    try {
      const list_of_item: TodoItem[] = JSON.parse(data ?? "[]");
      setListofitems(list_of_item);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setListofitems([]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  // function for deleting the element
  function handletobedelted(id: number) {
    const newlist = listofitems.filter(item => item.id !== id);
    localStorage.setItem('todos', JSON.stringify(newlist));
    setListofitems(newlist);
    alert("successfully deleted");
  }
// handling the input to be edited
  function handletobeedited(id: number) {
    setListofitems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, todo: editinputvalue } : item
      )
    );
    localStorage.setItem('todos', JSON.stringify(listofitems));
    Seteditinput(false);
    Seteidtid(-1);
  }
//the eidting functionality
  function changethelayout(id: number) {
    Seteditinput(true);
    Seteidtid(id);
    const itemToEdit = listofitems.find(item => item.id === id);
    if (itemToEdit) {
      Seteditinputvalue(itemToEdit.todo);
    }
  }

  const handleedit = (event: React.ChangeEvent<HTMLInputElement>) => {
    Seteditinputvalue(event.target.value);
  };
// function to add new element into the list
  function addition(event: React.MouseEvent<HTMLButtonElement>): void {
    if (!inputValue.trim()) return;

    // Generate a unique ID (using timestamp or incrementing from last ID)
     const newId = listofitems.length > 0 
       ? Math.max(...listofitems.map(item => item.id)) + 1 
       : 1;

    const newTodo = { todo: inputValue, id: newId};
    const updatedList = [...listofitems, newTodo];

    localStorage.setItem('todos', JSON.stringify(updatedList));
    setListofitems(updatedList);
    setInputValue("");
  }

  return (
    <div className='mainwarrper'>
      <div className='title'>
        <h1>your to do's</h1>
      </div>
      <div className="inputclass">
        <input
          type="text"
          value={inputValue} 
          onChange={handleInputChange}
        />
      </div>
      <div className="addtodobutton">
        <button onClick={addition}>add to do</button>
      </div>
      <div className="todo">
        <ul>
          {listofitems.map((item) => (
            <div className="listoftodo" key={item.id}>
              {editid === item.id ? (
                <input 
                  className="handleinput"
                  value={editinputvalue}
                  onChange={handleedit}
                  onBlur={() => handletobeedited(item.id)}
                  autoFocus
                />
              ) : (
                <li>{item.todo}</li>
              )}
              <div className="materialicon">
                <DeleteIcon onClick={() => handletobedelted(item.id)} />
                <EditIcon onClick={() => changethelayout(item.id)} />          
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export  {Todolist};



