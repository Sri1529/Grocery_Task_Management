import React, { useState, useEffect,useCallback  } from 'react';
import axios from 'axios';
import './GroupComponent.css';
import { useParams, useLocation } from 'react-router-dom';

const GroupComponent = () => {
  const { groupName } = useParams();
  const location = useLocation();
  const { phone } = location.state || {};
  const [groupMembers, setGroupMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [itemsFromAPI, setItemsFromAPI] = useState([]);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
 //console.log(phone)
const [groupId, setGroupId] = useState(null);

  // eslint-disable-next-line no-unused-vars
const [error, setError] = useState(null);

  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  // const [assignedItem, setAssignedItem] = useState(''); // Changed the state name
  // const [quantity, setQuantity] = useState(0);
  // const [unit, setUnit] = useState(0);
  // const [count, setCount] = useState(0);
  // const [dueDate, setDueDate] = useState(null);
  const [asigned_to, setasignedto] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items to display per page
  // const itemsFromAPI = []; // Replace with your actual data
  const totalPages = Math.ceil(itemsFromAPI.length / itemsPerPage);
  const [currentAssignedTo, setCurrentAssignedTo] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [taskModalHeader, setTaskModalHeader] = useState('Assign Task');
  const [isMyTaskModalOpen, setMyTaskModalOpen] = useState(false);
  // const [isTaskCompleted, setTaskCompleted] = useState(/* initial value */);
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    assignedItem: '',
    quantity: 0,
    unit: 0,
    count: 0,
    dueDate: null,
    assigned_by:'',
  });

  const [taskForms, setTaskForms] = useState([
    {
      assignedItem: '',
      quantity: 0,
      unit: 0,
      count: 0,
      dueDate: null, 
    },
  ]);
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []); // Empty dependency array
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = itemsFromAPI.slice(startIndex, endIndex);

    return currentItems.map((itemName, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            id={`item-checkbox-${index}`}
            name={`item-checkbox-${index}`}
            value={itemName}
            onChange={() => handleCheckboxChange(itemName)}
          />
        </td>
        <td>{itemName}</td>
      </tr>
    ));
  };


  const fetchTasks = useCallback(async () => {
    try {
      console.log("phonee:", phone);

      const response = await axios.get(`http://13.201.44.172/tasks/${groupId}/${phone}`);
      console.log("tasks", response);
      setTasks(response.data.tasks);

      if (response.data.tasks.length > 0) {
        const firstTask = response.data.tasks[0];
        setTaskForm({
          assignedItem: firstTask.name || '',
          quantity: firstTask.quantity || 0,
          unit: firstTask.unit || '',
          count: firstTask.count || 0,
          assigned_by: firstTask.assigned_by || '',
          dueDate: firstTask.due_date || null,
        });

        // Assuming fetchUserNametask is defined somewhere
         fetchUserNametask(firstTask.assigned_by);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [groupId, phone]);
  

  const fetchUserNametask = async (assignedBy) => {
    try {
      const response = await axios.get(`http://13.201.44.172/users/name?phone=${assignedBy}`);
      const userName = response.data.result;
      console.log('User Name:', userName);

  
      setTaskForm((prevTaskForm) => ({
        ...prevTaskForm,
        assigned_by: userName,
      }));
      // Now you can use the userName as needed in your component state or UI
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };
  
  useEffect(() => {
    if (groupId !== null) {
      fetchTasks();
    }
  }, [fetchTasks, groupId, phone])

  
  const handleFindPhone = async (name) => {
    try {
      console.log("assigned too phonee", name);
      const response = await axios.get(`http://13.201.44.172/users/phone?name=${name}`);
      
      // Check if response.data.result exists before setting the state
      if (response.data.result) {
        setasignedto(response.data.result);
      } else {
        console.log("Phone number not found for the given name");
        // Handle the case where the phone number is not found
      }
    } catch (error) {
      console.error('Error finding phone number:', error.response?.data?.error);
      // Handle the error as needed
    }
  };
  
  useEffect(() => {
    if (currentAssignedTo !== '') {
      handleFindPhone(currentAssignedTo);
    }
  }, [currentAssignedTo]);
  
  

  const handleFetchGroupId = useCallback(async () => {
    try {
      // Make a GET request to the API endpoint with the group name
      const response = await axios.get(`http://13.201.44.172/groups/${groupName}`);
  
      // Update state with the retrieved group id
      setGroupId(response.data.groupId);
      setError(null); // Clear any previous errors
      // console.log("group id:", groupId);
    } catch (error) {
      // Handle errors, update state with the error message
      console.error('Error fetching group id:', error);
      setGroupId(null);
      setError(error.response?.data?.message || 'An error occurred');
    }
  }, [groupName]);
  
  const handleSubmittask = async () => {
    try {
      // Assuming you have unique properties like 'id'
      const tasksToUpdate = tasks
        .filter((task) => task.status === 'Completed')
        .map(({ id }) => ({ id }));

      console.log("Tasks to Update:", tasksToUpdate);

      // Send a request to update the completed_on column in the database
      const response = await axios.put('http://13.201.44.172/update-completed-on', { completedTasks: tasksToUpdate });

      // Optionally, you can fetch the updated tasks from the server after submission
      // await fetchTasks(); // Update this function based on your API endpoint

      // Update the UI with the modified tasks
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.status === 'Completed' ? { ...task, status: 'Pending' } : task
        )
      );
      setMyTaskModalOpen(false);
      fetchTasks();
    // setIsModalOpen(false);
      console.log("Update Response:", response.data);
    } catch (error) {
      console.error('Error submitting tasks:', error);
    }
  };
  
  
  
  
  
  
  
  

  const handleSubmit = useCallback(async () => {
    try {
      const data = {
        groupId: groupId,
        items: selectedItems,
      };
  
      await axios.post('http://13.201.44.172/group_groceries', data);
  
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting items:', error);
    }
  }, [groupId, selectedItems, handleCloseModal]);
  
  const handleAssignTask = async (assignedTo) => {
    try {
      // Fetch group groceries names based on the group ID
      const response = await axios.get(`http://13.201.44.172/group_groceries_names`, {
        params: {
          groupId: groupId, // Replace with the actual integer value
        }
      });
  
      const items = response.data.result; // Use items directly, no need for item.name
      // console.log("group id:", groupId);
      // console.log("response:", response);
  
      // Convert assignedTo to string
      const assignedToString = assignedTo.toString();
  
      // Handle the task assignment
      handleTaskAssignment(assignedToString);
      handleFindPhone(assignedTo)
      setCurrentAssignedTo(assignedTo);
      
      // Set the items from the API and open the task modal
      setItemsFromAPI(items);
      setTaskModalOpen(true);
  
    } catch (error) {
      console.error('Error fetching items:', error);
      // console.log("group id:", groupId);
      // Handle errors if needed
    }
  };
  


  const handleTickButtonClick = (formIndex) => {
    setTaskForms((prevTaskForms) => [
      ...prevTaskForms.slice(0, formIndex + 1),
      {
        assignedItem: '',
        quantity: 0,
        unit: 0,
        count: 0,
      },
      ...prevTaskForms.slice(formIndex + 1),
    ]);
  };

  const handleDeleteButtonClick = (formIndex) => {
    setTaskForms((prevTaskForms) => {
      const newTaskForms = [...prevTaskForms];
      newTaskForms.splice(formIndex, 1); // Remove the task form at the specified index
      return newTaskForms;
    });
  };

  const handleTaskAssignment = async (assignedTo) => {
    try {
      // console.log('Task assigned to:', assignedTo);
      // await handleTaskSubmit(assignedTo);
      // console.log('Tasks submitted successfully!');
  
      // Set the items from the API and open the task modal
      const response = await axios.get(`http://13.201.44.172/group_groceries_names`, {
        params: {
          groupId: groupId,
        }
      });
      const items = response.data.result;
      setItemsFromAPI(items);
      setTaskModalOpen(true);
    } catch (error) {
      console.error('Error during task assignment:', error);
      // Handle errors if needed
    }
  };
  

  const handleTaskSubmit = async (assignedTo) => {
    try {
      // Convert assignedTo to string
      // const assignedToString = assignedTo.toString();
    // console.log("agagga:",asigned_to)
      // Iterate through each task form and submit the task
      // console.log("assigner tooooo:", assignedToString);
      for (const taskForm of taskForms) {
        const data = {
          group_id: groupId,
          assigned_by: phone,
          assigned_to: asigned_to,
          due_date: taskForm.dueDate,
          isActive: true,
          cretaed_at: new Date(),
          updated_at: new Date(),
          name: taskForm.assignedItem,
          unit: taskForm.unit,
          quantity: taskForm.quantity,
          count: taskForm.count,
        };
  
        // Log the data before making the request
        console.log('Task Data:', data);
  
        // Make a POST request to insert the task into the tasks table
        await axios.post('http://13.201.44.172/tasks', data);
      }
  
      // Close the modal after submitting all tasks
      setTaskModalOpen(false);
      resetTaskForms();
      setMyTaskModalOpen(false);
    } catch (error) {
      console.error('Error submitting tasks:', error);
      // Handle errors as needed
    }
  };
  
  

  const handleCloseTaskModal = () => {
    setTaskModalOpen(false);
    setMyTaskModalOpen(false);
    resetTaskForms();
  };
  
  const resetTaskForms = () => {
    setTaskForms([
      {
        assignedItem: '',
        quantity: 0,
        unit: 0,
        count: 0,
      },
    ]);
  };
  const fetchUserName = useCallback(async () => {
    try {
      const response = await axios.get('http://13.201.44.172/user_groups/name', {
        params: {
          phone: phone,
        },
      });

      setUserName(response.data.result);
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  }, [phone]);

  useEffect(() => {
    fetchUserName();
    handleFetchGroupId();
    
  }, [fetchUserName, handleFetchGroupId, phone]);// Fetch user name when 'phone' changes

  useEffect(() => {
    if (groupId !== null) {
      handleSubmit();
    }
  }, [groupId, handleSubmit]);
  
  
  const handleAddMember = () => {
    setAddMemberModalOpen(true);
  };

  
  // ... (rest of your component code)

  const handleCheckboxChange1 = (e, index, taskId) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = e.target.checked ? 'Completed' : 'Pending';
    setTasks(updatedTasks);
  
    // Now you have both the index and taskId available for further processing
    console.log('Checkbox changed for task with index:', index, 'and id:', taskId);
  };
  

  
  const handleAddMemberSubmit = async () => {
    try {
      if (newMember.trim() !== '') {
        // Make a request to search for the user by phone number
        const userResponse = await axios.get(`http://13.201.44.172/users?phone=${newMember}`);
        const user = userResponse.data.result[0];

        console.log('User Response:', userResponse.data); // Log the user response

        if (user) {
          // If the user is found, add their name to the group members

          // Make a request to get the user_id from the users table
          const userIdResponse = await axios.get(`http://13.201.44.172/users/id?phone=${newMember}`);
          const userId = userIdResponse.data.result;

           console.log('User ID Response:', userIdResponse.data); // Log the user ID response

          // Make a request to get the group_id from the groups table
          const groupResponse = await axios.get(`http://13.201.44.172/get_group_id?groupName=${groupName}`);
          const groupId = groupResponse.data.result;

           console.log('Group ID Response:', groupResponse.data); // Log the group ID response

          // Insert user_id, group_id, name, phone, and group_name into the user_groups table
          await axios.post('http://13.201.44.172/user_groups', {
            user_id: userId,
             group_id: groupId,
            name: user.name,
            phone: newMember,
            group_name: groupName, // Include group_name in the request body
          });

           console.log('User added to the group');

          // Refresh the group members after adding a new member
          fetchGroupMembers();
         

        } else {
          console.log('User not found');
        }

        // Close the modal and reset the input field
        setNewMember('');
        setAddMemberModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding user to the group:', error);
    }
  };

  const handleSelectItems = () => {
    setModalOpen(true);
  };

 

  
  const handleCheckboxChange = (itemName) => {
    // Toggle the selection status of the item
    setSelectedItems((prevItems) => {
      const isItemSelected = prevItems.includes(itemName);
      if (isItemSelected) {
        return prevItems.filter((item) => item !== itemName);
      } else {
        return [...prevItems, itemName];
      }
    });
  };
// console.log("selected items",selectedItems)

      
  
  

  // Fetch group members based on the group name
  const fetchGroupMembers = useCallback(async () => {
    try {
      const response = await axios.get(`http://13.201.44.172/user_groups?group_name=${groupName}`);
      const members = response.data.result.map((member) => member.name);
      setGroupMembers(members);
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  }, [groupName]); // Only include the dependencies needed for the function


  useEffect(() => {
    // Call the fetchGroupMembers function here
    fetchGroupMembers();
  }, [fetchGroupMembers]);
  
  // Fetch items from the API when the modal is open
  useEffect(() => {
    if (isModalOpen) {
      axios.get('http://13.201.44.172/mastergrocery')
        .then(response => {
          setItemsFromAPI(response.data.result);
        })
        .catch(error => {
          console.error('Error fetching data from the API:', error);
        });
    }
  
    // Fetch group members when the component mounts or when isModalOpen changes
    fetchGroupMembers();
  }, [isModalOpen, groupName, fetchGroupMembers]);
  

//   console.log('quantity:', quantity);
// console.log('unit:', unit);
// console.log('count:', count);

// console.log("username:",userName)
// console.log("member:",groupMembers)

  return (
    <div className="group-container">
      <div className="group-title">
        <h2>{groupName}</h2>
        <div className="add-member-section">
          <button onClick={handleAddMember} className="add-member-button">
            Add Member
          </button>
          <button onClick={handleSelectItems} className="add-task-button">
          + 
        </button>
          {/* Add member pop-up */}
          {isAddMemberModalOpen && (
            <div className="add-member-modal">
              <input
                type="text"
                placeholder="Enter member name"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
              />
              <button onClick={handleAddMemberSubmit}>Add</button>
            </div>
          )}
        </div>
      </div>
      
      <ul className="group-list">
      {groupMembers.map((member, index) => (
  <div key={index} className="list-item-container">
    <li className="group-list-item">{member}</li>
    
    {member !== userName && (
      <button
      onClick={(e) => {
        e.stopPropagation(); // Stop the event propagation
        const memberName = member; // Assuming member is the correct member name
        handleAssignTask(memberName);
        handleTaskAssignment(memberName); // Pass the correct member name
      }}
      className="select-items-button"
    >
      Assign Task
    </button>
    
    )}
    
    {member === userName && (
  <button
    onClick={() => {
      setTaskModalHeader('My Task');
      setMyTaskModalOpen(true); // Open the My Task modal
    }}
    className="my-task-button"
  >
    My Task
  </button>
)}


  
  </div>
))}
      </ul>

      <div className="common-textbox-container">
        <input
          type="text"
          className="common-textbox"
          placeholder="No pending Tasks"
        />
      </div>

      {isTaskModalOpen && (
  <div className="modal-container">
    <div className="modal-content">
      <h3>Assign Task</h3>
      {/* Render all task forms */}
      {taskForms.map((taskForm, formIndex) => (
        <div key={formIndex} className="task-form">
          <div className="form-row">
            <label htmlFor={`items-${formIndex}`}>Select Item:</label>
            <select
  id={`items-${formIndex}`}
  value={taskForm.assignedItem}
  onChange={(e) => {
    const selectedValue = e.target.value;
    setTaskForms((prevTaskForms) => {
      const newTaskForms = [...prevTaskForms];
      newTaskForms[formIndex].assignedItem = selectedValue;
      return newTaskForms;
    });
  }}
>
  {/* Options for dropdown */}
  {itemsFromAPI.map((itemName, index) => (
    <option key={index} value={itemName}>
      {itemName}
    </option>
  ))}
</select>

          </div>

          {/* Unit input */}
          <div className="form-row">
  <label htmlFor={`unit-${formIndex}`}>Unit:</label>
  <select
    id={`unit-${formIndex}`}
    value={taskForm.unit}
    onChange={(e) =>
      setTaskForms((prevTaskForms) => {
        const newTaskForms = [...prevTaskForms];
        newTaskForms[formIndex].unit = e.target.value;
        return newTaskForms;
      })
    }
  >
    <option value="list">Litre</option>
    <option value="gram">Gram</option>
    <option value="kilogram">Kilogram</option>
  </select>
</div>

          {/* Quantity input */}
          <div className="form-row">
            <label htmlFor={`quantity-${formIndex}`}>Quantity:</label>
            <div className="quantity-input">
              <button
                className="quantity-btn"
                onClick={() =>
                  setTaskForms((prevTaskForms) => {
                    const newTaskForms = [...prevTaskForms];
                    newTaskForms[formIndex].quantity = Math.max(0, parseFloat(newTaskForms[formIndex].quantity) - 1);
                    return newTaskForms;
                  })
                }
              >
                -
              </button>
              <input
                type="text"
                id={`quantity-${formIndex}`}
                value={taskForm.quantity}
                onChange={(e) =>
                  setTaskForms((prevTaskForms) => {
                    const newTaskForms = [...prevTaskForms];
                    newTaskForms[formIndex].quantity = e.target.value;
                    return newTaskForms;
                  })
                }
              />
              <button
                className="quantity-btn"
                onClick={() =>
                  setTaskForms((prevTaskForms) => {
                    const newTaskForms = [...prevTaskForms];
                    newTaskForms[formIndex].quantity = parseFloat(newTaskForms[formIndex].quantity) + 1;
                    return newTaskForms;
                  })
                }
              >
                +
              </button>
            </div>
          </div>

          


          {/* Count input */}
          <div className="form-row">
            <label htmlFor={`count-${formIndex}`}>Count:</label>
            <div className="count-input">
              <button
                className="count-btn"
                onClick={() =>
                  setTaskForms((prevTaskForms) => {
                    const newTaskForms = [...prevTaskForms];
                    newTaskForms[formIndex].count = Math.max(0, parseInt(newTaskForms[formIndex].count, 10) - 1);
                    return newTaskForms;
                  })
                }
              >
                -
              </button>
              <input
                type="text"
                id={`count-${formIndex}`}
                value={taskForm.count}
                onChange={(e) =>
                  setTaskForms((prevTaskForms) => {
                    const newTaskForms = [...prevTaskForms];
                    newTaskForms[formIndex].count = e.target.value;
                    return newTaskForms;
                  })
                }
              />
              <button
                className="count-btn"
                onClick={() =>
                  setTaskForms((prevTaskForms) => {
                    const newTaskForms = [...prevTaskForms];
                    newTaskForms[formIndex].count = parseInt(newTaskForms[formIndex].count, 10) + 1;
                    return newTaskForms;
                  })
                }
              >
                +
              </button>
            </div>
          </div>

          {/* Due Date input */}
<div className="form-row">
  <label htmlFor={`dueDate-${formIndex}`}>Due Date:</label>
  <input
    type="date"
    id={`dueDate-${formIndex}`}
    value={taskForm.dueDate}
    onChange={(e) =>
      setTaskForms((prevTaskForms) => {
        const newTaskForms = [...prevTaskForms];
        newTaskForms[formIndex].dueDate = e.target.value;
        return newTaskForms;
      })
    }
  />
</div>

          {/* Green tick mark button */}
          <div className="form-row">
            <button
              className="tick-button"
              onClick={() => handleTickButtonClick(formIndex)}
            >
              &#10004;
            </button>
          </div>

          {/* Red X mark button */}
          <div className="form-row">
          <button className="x-button" onClick={
            () => handleDeleteButtonClick(formIndex)}>&#10008;</button>
          </div>
        </div>
      ))}

      <div className="button-container">
        <button onClick={handleTaskSubmit} className="submit-button">
          Submit Task
        </button>
        <button onClick={handleCloseTaskModal} className="close-modal-button">
          Close
        </button>
      </div>
    </div>
  </div>
)}


{isMyTaskModalOpen && (
  <div className="custom-modal-container">
    <div className="custom-modal-content">
      <div className="custom-modal-header">
        <h3>My Task</h3>
        <button onClick={handleCloseTaskModal} className="custom-close-modal-button">
          X
        </button>
      </div>

      {/* Display the assigned task information */}
      <div className="custom-assigned-info">
        <table>
          <thead>
            <tr>
              <th>Check Box</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Count</th>
              <th>Assigned By</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>
                <input
            type="checkbox"
            id={`customTaskCheckbox_${task.id}`}
            checked={task.status === 'Completed'}
            onChange={(e) => handleCheckboxChange1(e, index, task.id)}
          />


                </td>
                <td>{task.name}</td>
                <td>{`${task.quantity} ${task.unit}`}</td>
                <td>{task.count}</td>
                <td>{taskForm.assigned_by}</td>
                <td>{task.due_date ? new Date(task.due_date).toLocaleDateString('en-GB') : ''}</td>
                <td>{task.status === 'Completed' ? 'Completed' : 'Pending'}</td>
                <td>{task.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="custom-submit-button" onClick={handleSubmittask}>Submit</button>
    </div>
  </div>
)}










    
      {/* Pop-up Modal for Select Items */}
      {isModalOpen && (
        <div className="modal-container">
          <div className="modal-content">
            <h3>Select Items to save in your group task</h3>
            <table className="item-table">
              <thead>
                <tr>
                  <th>Checkbox</th>
                  <th>Item Name</th>
                </tr>
              </thead>
              <tbody>{renderItems()}</tbody>
            </table>
            <div className="button-container">
              <button onClick={handleSubmit} className="submit-button">
                Submit
              </button>
              <button onClick={handleCloseModal} className="close-modal-button">
                Close
              </button>
            </div>
            {/* Pagination */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupComponent;
