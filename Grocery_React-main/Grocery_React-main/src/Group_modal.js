import React, { useState, useEffect } from 'react';

const GroupModal = ({ isOpen, onClose, onSubmit, phone }) => {
  const [groupName, setGroupName] = useState('');
  const [icon, setIcon] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`https://13.201.44.172/user_details?phone=${phone}`);
        const result = await response.json();

        if (response.ok) {
          setUserDetails(result.result);
        } else {
          console.error('Failed to fetch user details:', result);
        }
      } catch (error) {
        console.error('Error during user details fetch:', error);
      }
    };

    if (isOpen) {
      fetchUserDetails();
    }
  }, [isOpen, phone]);

  const handleSubmit = async () => {
    try {
      // Check if user details are available
      if (!userDetails) {
        console.error('User details not available');
        return;
      }

      // Insert data into the 'groups' table
      const groupResponse = await fetch('https://13.201.44.172/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createdBy: phone,
          groupStatus: true,
          icon: icon || null,
          isActive: true,
          name: groupName,
        }),
      });

      const groupResult = await groupResponse.json();

      if (!groupResponse.ok) {
        console.error('Failed to insert data into groups table:', groupResult);
        return;
      }

      console.log('Group data inserted successfully:', groupResult);

      // Get the 'group_id' from the response
      const groupId = groupResult.group_id;

      // Insert data into the 'user_groups' table
      const userGroupResponse = await fetch('https://13.201.44.172/user_groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userDetails.id, // Use the 'id' from user details
          group_id: groupId,
          name: userDetails.name,
          phone: phone,
          group_name: groupName,
        }),
      });

      const userGroupResult = await userGroupResponse.json();

      if (userGroupResponse.ok) {
        console.log('Data inserted into user_groups table successfully:', userGroupResult);
        // You can perform additional actions after successful insertion if needed
      } else {
        console.error('Failed to insert data into user_groups table:', userGroupResult);
      }
    } catch (error) {
      console.error('Error during data insertion:', error);
    }

    // Close the modal
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2 style={{ color: '#5A9C56' }}>Create New Group</h2>
        <div className="modal-header">
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <label>
          Group Name:
          <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
        </label>
        <label>
          Icon:
          <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} />
        </label>
        <button
          style={{
            backgroundColor: '#5A9C56',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'background-color 0.3s',
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default GroupModal;
