import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Import the X icon
import '../App.css'; // Assuming you have some styles in App.css

const FormContainer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [data, setData] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9000');
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      axios.put('http://localhost:9000/update', { id: editId, ...formData })
        .then(response => {
          console.log('Form updated successfully:', response.data);
          setIsEditMode(false);
          setEditId(null);
          setFormData({
            name: '',
            email: '',
            phone: '',
          });
          setIsFormVisible(false);
          fetchData();
        })
        .catch(error => {
          console.error('There was an error updating the form:', error);
        });
    } else {
      axios.post('http://localhost:9000/create', formData)
        .then(response => {
          console.log('Form submitted successfully:', response.data);
          setFormData({
            name: '',
            email: '',
            phone: '',
          });
          setIsFormVisible(false);
          fetchData();
        })
        .catch(error => {
          console.error('There was an error submitting the form:', error);
        });
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:9000/delete/${id}`)
      .then(response => {
        console.log('Deleted successfully:', response.data);
        fetchData();
      })
      .catch(error => {
        console.error('There was an error deleting the data:', error);
      });
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      email: item.email,
      phone: item.phone,
    });
    setEditId(item._id);
    setIsEditMode(true);
    setIsFormVisible(true);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
    if (!isFormVisible) {
      setIsEditMode(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
      });
    }
  };

  return (
    <div className="form-wrapper">
      {!isFormVisible && (
        <button className="add-button" onClick={toggleFormVisibility}>Add</button>
      )}
      {isFormVisible && (
        <div className="form-container">
          <div className="form-header">
            <h2>{isEditMode ? 'Edit Entry' : 'Add New Entry'}</h2>
            <FaTimes className="close-icon" onClick={toggleFormVisibility} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="submit-button">{isEditMode ? 'Update' : 'Submit'}</button>
          </form>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormContainer;
