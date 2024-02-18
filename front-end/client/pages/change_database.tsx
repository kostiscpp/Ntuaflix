import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Upload = () => {
    interface User {  
        username: string;
        password: string;
        first_name: string;
        last_name: string;
        birth_date: string;
        role: string;
        account_status: string;
    }
    const EMPTYUSER: User = { 
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        birth_date: '',
        role: '',
        account_status: ''
    };
    const [users, setUsers] = useState<User>(EMPTYUSER);
    const [showData, setShowData] = useState(false);
    const router = useRouter();
    const home = async () => {
        try {
            const response = await fetch('https://localhost:8080/api/isadmin', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token')},
            });
            const data = await response.json();
            if (data.isAdmin) {
                router.push('/adminhome');
            } else { 
                router.push('/homepage');
            
            }
        } catch (e) {
            console.log(e);
        }
    }
    const logout = async () => {  
        try{
            const response = await fetch('https://localhost:8080/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (data.success) {
                localStorage.removeItem('access_token');
                router.push('/');
            } else {
                console.log("failure");
            }
        }catch(e){
            console.log(e);
        }
    }

    const uploadForms = [
        { id: 'upload/titlebasics', label: 'Title Basics' },
        { id: 'upload/titleakas', label: 'Title Akas' },
        { id: 'upload/namebasics', label: 'Name Basics' },
        { id: 'upload/titlecrew', label: 'Title Crew' },
        { id: 'upload/titleepisode', label: 'TitleEpisode' },
        { id: 'upload/titleprincipals', label: 'Title Principals' },
        { id: 'upload/titleratings', label: 'Title Ratings' }
    ];

    const handleUserData = async (e: any) => {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value;

        try {
            const response = await fetch(`https://localhost:9876/ntuaflix_api/admin/users/${username}`, {
                method: 'GET', // na to alla3w se GET
                headers: { 'Content-Type': 'application/json','x-observatory-auth': localStorage.getItem('access_token') ?? ''},
            });
            const data = await response.json();
            if (response.status === 200) {
                console.log(data);
                setUsers(data);
                setShowData(true);
                

            } else {
                alert("Failed to get user data");
            }
        } catch (e) {
            alert('There was an error, please try again later');
            console.log(e);
        }
    }

    const handleAddUser = async (e: any) => {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value;
        const password = form.password.value;

        try {
            const response = await fetch(`https://localhost:9876/ntuaflix_api/admin/usermod/${username}/${password}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','x-observatory-auth': localStorage.getItem('access_token') ?? '' },
            });
            if (response.status === 200) {
                alert("User added successfully");
            } else {
                alert("Failed to add/modify user");
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleFileUpload = async (e: any, formId: any) => {
        e.preventDefault();

        const token = localStorage.getItem('access_token') ?? '';
        if (!token){  
            alert('You must be logged in to upload files.');
            return;
        }


        console.log('about to read');

        const fileInput = document.getElementById(formId) as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files.length>0){  
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = async (e: any) => { 
                console.log('just read'); 
                const text = e.target.result;
                const endpoint = `https://localhost:9876/ntuaflix_api/admin/${formId}`;
                console.log('about to fetch');
                try {  
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {  
                            'Content-Type': 'text/tab-separated-values',
                            'x-observatory-auth': token
                        },
                        body: text as string,
                    });

                    if (response.status === 200) {
                        alert("File uploaded successfully");
                    } else {
                        alert("Failed to upload file");
                    }
                } catch (e) {
                    alert('There was an error, please try again later');
                }
            }

            reader.readAsText(file);
        } else {  
            alert("No file selected");
        }
    };

    const handleHealthCheck = async () => {
        try {
            const response = await fetch('https://localhost:9876/ntuaflix_api/admin/healthcheck', { 
            method: 'GET',    
            headers: { 'x-observatory-auth': localStorage.getItem('access_token') ?? '' } 
        });
            const data = await response.json();
            if (response.status === 200) {
                alert("Healthcheck successful");
            } else {
                alert("Healthcheck failed");
            }
        } catch (e) {
            alert('Could not establish connection to server');
        }
    };

    const handleResetAll = async () => {
        const confirmed = window.confirm("Are you sure you want to reset the database? This action cannot be undone.");
        if (confirmed) {
            try {
                const response = await fetch('https://localhost:9876/ntuaflix_api/admin/reset_all', {
                    method: 'POST',
                    headers: { 'x-observatory-auth': localStorage.getItem('access_token') ?? '' },
                    });
                if (response.status === 200) {
                    alert("Database reset successfully");
                } else {
                    alert("Failed to reset database");
                }
            } catch (e) {
                alert('There was an error, please try again later');
            }
        }
    };

    

    return (
        <div className="container">
          <Head>
            <title>Ntuaflix - Upload</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="top-bar">
            <div className="top-left" onClick={home}>
                Ntuaflix
            </div>
            <div className="top-center">
                Upload
            </div>
            <div className="top-right" onClick={logout}>
                Logout
            </div>
        </div>
      
        <div className="upload-forms">
            {uploadForms.map(form => (
                <div key={form.id} className="upload-form">
                    <span>{form.label}</span>
                    <input type="file" id={form.id} name={form.id} />
                    <button onClick={(e) => handleFileUpload(e, form.id)}>Upload</button>
                </div>
            ))}
        </div>
        
        <div className='forms-container'>
            <div className="user-form-container">
                <h2>Add User or Modify Existing</h2>
                <form onSubmit={handleAddUser}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
            <div className="user-form-container">
                <h2>Get user data</h2>
                <form onSubmit={handleUserData}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" required />
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </div>


        {showData && (
                    <div className="data-container">
                        <h2>User Data</h2>
                        <ul>
                           
                            <li key={users.username}>
                                <span>Username: {users.username}</span>
                                {/* <span>Password: {users.password}</span> */}
                                <span>First Name: {users.first_name}</span>
                                <span>Last Name: {users.last_name}</span>
                                <span>Birth Date: {users.birth_date}</span>
                                <span>Role: {users.role}</span>
                                <span>Account Status: {users.account_status}</span>
                            </li>
                            
                        </ul>
                    </div>
                )}

        <div className="action-buttons">
            <button onClick={handleHealthCheck} className="healthcheck-button">Healthcheck</button>
            <button onClick={handleResetAll} className="reset-button">Reset All</button>
        </div>

        
      
          <style jsx>{`
            .container {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f0f0f0;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            

            .top-bar {
                background-color: #0074d9; /* Blue color */
                color: #fff;
                padding: 10px;
                text-align: left;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 1200px;
                margin: 0 auto;
            }

            .top-left {
                flex: 1;
                font-size: 24px;
                cursor: pointer;
            }
            .top-center {
                flex: 1;
                text-align: center;
                font-size: 24px;
            }

            .top-right {
                flex: 1;
                text-align: right;
                font-size: 24px;
                cursor: pointer;
            }
      
            .upload-forms {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .upload-form {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background-color: #fff;
                //border: 1px solid #ccc;
                border-radius: 5px;
            }

            .upload-form span {
                margin-right: 10px;
            }

            .upload-form input[type="file"] {
                flex-grow: 1;
            }

            .upload-form button {
                background-color: #0074d9; /* Blue color */
                color: #fff;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                margin-left: 10px;
            }

            .forms-container {
                display: flex;
                justify-content: space-between;
                padding: 20px;
                gap: 20px; /* This creates spacing between the two forms */
            }
        
            .user-form-container {
                flex: 1; /* This makes each form container take equal width */
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                margin-top: 20px;
            }
              
              .form-group {
                margin-bottom: 15px;
              }
              
              .form-group label {
                display: block;
                margin-bottom: 5px;
              }
              
              .form-group input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
              }
              
              .submit-button {
                background-color: #0074d9; /* Blue color */
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
              }

            .healthcheck-button {
                background-color: #00e600; /* Green */
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 10px;
              }
              
              .reset-button {
                background-color: #ff0000; /* Red */
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 10px;
              }

              .data-container {
                background-color: #f9f9f9; /* Light grey background */
                border: 1px solid #ddd; /* Light border */
                border-radius: 8px; /* Rounded corners */
                padding: 20px; /* Padding inside the container */
                margin-top: 20px; /* Space above the container */
                max-width: 600px; /* Maximum width */
                margin-left: auto; /* Center align */
                margin-right: auto;
              }
            
              .data-container h2 {
                color: #333; /* Dark grey color for the heading */
                margin-bottom: 16px; /* Space below the heading */
              }
            
              ul {
                list-style-type: none; /* Remove default list styling */
                padding: 0; /* Remove default padding */
              }
            
              li {
                background-color: #fff; /* White background for list items */
                border: 1px solid #eee; /* Light border for list items */
                padding: 10px; /* Padding inside list items */
                margin-bottom: 10px; /* Space between list items */
                border-radius: 4px; /* Rounded corners for list items */
              }
            
              li span {
                display: block; /* Each span on its own line */
                color: #555; /* Darker text color for better readability */
                margin-bottom: 8px; /* Space between each piece of information */
              }
            
              li span:last-child {
                margin-bottom: 0; /* No space after the last piece of information */
              }
          `}</style>
        </div>
      );


};

export default Upload;