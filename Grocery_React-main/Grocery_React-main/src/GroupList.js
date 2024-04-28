import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './Style.css';

const GroupList = ({ onGroupAdded,phone }) => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();  // Get the navigate function
  // console.log(phone)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://13.201.44.172/groups', {
          headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          },
          params: {
            phone: phone,
          },
        });

        if (response.data && Array.isArray(response.data.result)) {
          setGroups(response.data.result);
        } else {
          console.error('Invalid data structure in API response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [onGroupAdded, phone]);

  const handleGroupClick = (groupName) => {
    // Navigate to the GroupComponent when a group button is clicked
    navigate(`/Groups/${groupName}`,{ state: { phone } });
  };

  return (
    <div className="My_Groups">
      <h1>My Groups</h1>
      <div className="group-list-container">
        <div className="group-list">
          {Array.isArray(groups) &&
            groups.map((groupName, index) => (
              <button
                key={index}
                className="group-button"
                onClick={() => handleGroupClick(groupName)}
              >
                {groupName}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GroupList;
