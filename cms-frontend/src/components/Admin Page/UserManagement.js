import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: ''
  });

  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send API request to backend
      console.log('Illa purila 1:',formData);
      const response = await axios.post('http://localhost:5000/api/admin/addUser', formData);
      const newCredentials = response.data.credentials;
      
      console.log('Illa purila 2:',formData);
      setMessage('User added successfully');
      setCredentials(newCredentials); 
      
      localStorage.setItem(response.data.credentials.username, response.data.credentials.password);
      setFormData({
        firstName: '',
        lastName: '',
        role: ''
      });
      
      // Capture the credentials (assuming they are returned from the backend)
      

      // Optionally refetch users to include the new user in the table
      const updatedUsers = await axios.get('http://localhost:5000/api/admin/users');
      console.log(updatedUsers);
      setUsers(updatedUsers.data);

      
      setTimeout(() => {
        setMessage('');
        setCredentials(null);
      }, 3000);
    } catch (error) {
      setMessage('Error adding user');
      console.error(error);
    }
  };

  // Fetch users when the component loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');  // Get token from localStorage
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Avlodhaan Mudichu viteenga ponga',response.data.users)
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false); // Make sure to stop loading when done
      }
    };

    fetchUsers();
  }, []);


  const handleDelete = async (username) => {
    if (username === 'SidAmrita') {
      alert('Cannot delete admin user');
      return;
    }
  
    if (window.confirm(`Are you sure you want to delete ${username}?`)) {
      try {
        await axios.delete('http://localhost:5000/api/admin/deleteUser', { data: { username } });
  
        setMessage('User deleted successfully');
        // fetchUsers(); // Fetch the updated list after deletion

        const updatedUsers = await axios.get('http://localhost:5000/api/admin/users');
        console.log(updatedUsers);
        setUsers(updatedUsers.data);
      } catch (error) {
        console.error('Error deleting user:', error);
        setMessage('Error deleting user');
      }
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className='user-management'>
      <div className="addUser">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          <input 
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="cashier">Cashier</option>
            <option value="kitchen_staff">Kitchen Staff</option>
          </select>
          
          <button type="submit">Add User</button>
        </form>
        {message && <p>{message}</p>}

        {/* Show generated credentials */}
        {credentials && (
          <div>
            <h3>Generated Credentials</h3>
            <p>Username: {credentials.username}</p>
            <p>Password: {credentials.password}</p>
          </div>
        )}
      </div>

      <div className="user-table-section">
        <h2>List of Users</h2>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role !== 'admin' && (
                        <>
                          <button 
                            onClick={() => {
                              const storedPassword = localStorage.getItem(user.username);
                              if (storedPassword) {
                                alert(`Username: ${user.username}\nPassword: ${storedPassword}`);
                              } else {
                                alert(`Username: ${user.username}\nPassword: Not available.`);
                              }
                            }}
                            style={{ marginRight: '10px' }}>
                            Show Credentials
                          </button>
                          <button 
                            onClick={() => handleDelete(user.username)}
                            style={{ backgroundColor: 'red', color: 'white' }}>
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;


