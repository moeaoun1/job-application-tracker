import React, { useState, useEffect } from 'react';
import './index.css';
import JobForm from './JobForm';

function App() {
    const [jobs, setJobs] = useState(() => {
        const savedJobs = localStorage.getItem('jobs');
        return savedJobs ? JSON.parse(savedJobs) : [];
    });

    const [filter, setFilter] = useState('All');
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedJob, setEditedJob] = useState({
        title: '',
        company: '',
        status: 'Applied',
        date: '',
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

    let filteredJobs = filter === 'All' ? jobs : jobs.filter((job) => job.status === filter);

    filteredJobs.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'date') {
            valA = new Date(valA);
            valB = new Date(valB);
        } else {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div>
            <h1>Job Application Tracker</h1>

            <p className="note-banner">
                Track your job applications easily. Add roles, update statuses, and stay organized throughout your job hunt.<br />
                <strong>Note:</strong> Your data is saved locally in your browser and won’t persist across devices.
            </p>

            <JobForm onAddJob={handleAddJob} />

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ marginRight: '0.5rem' }}>Filter by Status:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                </select>

                <label style={{ marginLeft: '1rem', marginRight: '0.5rem' }}>Sort by:</label>
                <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                    <option value="date">Date Applied</option>
                    <option value="title">Title</option>
                    <option value="status">Status</option>
                </select>

                <select
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value)}
                    style={{ marginLeft: '0.5rem' }}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Date Applied</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredJobs.map((job, index) => {
                    const actualIndex = jobs.findIndex(
                        (j) =>
                            j.title === job.title &&
                            j.company === job.company &&
                            j.status === job.status &&
                            j.date === job.date
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
                                    <input
                                        type="date"
                                        value={editedJob.date}
                                        onChange={(e) =>
                                            setEditedJob({ ...editedJob, date: e.target.value })
                                        }
                                    />
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
                            <td>{job.date}</td>
                            <td>
                                <button onClick={() => handleEditJob(actualIndex)}>Edit</button>
                                <button onClick={() => handleDeleteJob(actualIndex)}>Delete</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <footer className="footer">
                © 2025 Moe Aoun
            </footer>
        </div>
    );
}

export default App;
