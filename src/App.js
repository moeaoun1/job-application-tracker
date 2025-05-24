import React, { useState, useEffect } from 'react';
import JobForm from './JobForm';

function App() {
    const [jobs, setJobs] = useState(() => {
        const savedJobs = localStorage.getItem('jobs');
        return savedJobs ? JSON.parse(savedJobs) : [];
    });

    const [filter, setFilter] = useState('All');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedJob, setEditedJob] = useState({
        title: '',
        company: '',
        status: 'Applied',
    });

    useEffect(() => {
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }, [jobs]);

    const handleAddJob = (job) => {
        setJobs([...jobs, job]);
    };

    const handleDeleteJob = (indexToDelete) => {
        setJobs(jobs.filter((_, index) => index !== indexToDelete));
    };

    const handleEditJob = (index) => {
        setEditingIndex(index);
        setEditedJob(jobs[index]);
    };

    const handleSaveEdit = (index) => {
        const updatedJobs = [...jobs];
        updatedJobs[index] = editedJob;
        setJobs(updatedJobs);
        setEditingIndex(null);
    };

    const filteredJobs =
        filter === 'All' ? jobs : jobs.filter((job) => job.status === filter);

    return (
        <div>
            <h1>Job Application Tracker</h1>
            <JobForm onAddJob={handleAddJob} />

            <div>
                <label style={{ marginRight: '0.5rem' }}>Filter by Status:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredJobs.map((job, index) => {
                    const actualIndex = jobs.findIndex(
                        (j) =>
                            j.title === job.title &&
                            j.company === job.company &&
                            j.status === job.status
                    );

                    if (editingIndex === actualIndex) {
                        return (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        value={editedJob.title}
                                        onChange={(e) =>
                                            setEditedJob({ ...editedJob, title: e.target.value })
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={editedJob.company}
                                        onChange={(e) =>
                                            setEditedJob({ ...editedJob, company: e.target.value })
                                        }
                                    />
                                </td>
                                <td>
                                    <select
                                        value={editedJob.status}
                                        onChange={(e) =>
                                            setEditedJob({ ...editedJob, status: e.target.value })
                                        }
                                    >
                                        <option value="Applied">Applied</option>
                                        <option value="Interviewing">Interviewing</option>
                                        <option value="Offered">Offered</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleSaveEdit(actualIndex)}>Save</button>
                                    <button onClick={() => setEditingIndex(null)}>Cancel</button>
                                </td>
                            </tr>
                        );
                    }

                    return (
                        <tr key={index}>
                            <td>{job.title}</td>
                            <td>{job.company}</td>
                            <td>{job.status}</td>
                            <td>
                                <button onClick={() => handleEditJob(actualIndex)}>Edit</button>
                                <button onClick={() => handleDeleteJob(actualIndex)}>Delete</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default App;
