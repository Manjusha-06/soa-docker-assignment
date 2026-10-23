import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:2006/garden';

function App() {
  const emptyForm = {
    gardenName: '',
    areaSquareMeters: '',
    visitCount: '',
    active: true
  };

  const [gardens, setGardens] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchGardens();
  }, []);

  function showMessage(text, type = 'success') {
    setMessage(text);
    setMessageType(type);
  }

  function getApiErrorMessage(error, action = 'complete this request') {
    if (!error.response) {
      return 'Cannot connect to the backend. Make sure Spring Boot is running on port 2006 and check your CORS configuration.';
    }

    const status = error.response.status;

    if (status === 400) {
      return 'The server rejected the submitted data. Check the field values and try again.';
    }

    if (status === 401 || status === 403) {
      return 'You are not authorized to perform this action.';
    }

    if (status === 404) {
      return 'The requested garden or API endpoint was not found.';
    }

    if (status >= 500) {
      return 'A server or database error occurred. Check the Spring Boot Console.';
    }

    return `Unable to ${action}. Server returned status ${status}. Please try again.`;
  }

  async function fetchGardens(showErrors = true) {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/displayall`);
      setGardens(Array.isArray(response.data) ? response.data : []);
      return true;
    } catch (error) {
      if (showErrors) {
        showMessage(
          getApiErrorMessage(error, 'load garden records'),
          'danger'
        );
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  }

  function validateForm() {
    const name = form.gardenName.trim();
    const areaText = String(form.areaSquareMeters).trim();
    const visitsText = String(form.visitCount).trim();
    const area = Number(areaText);
    const visits = Number(visitsText);

    if (!name) {
      showMessage(
        'Garden name is required. Please enter a name.',
        'danger'
      );
      return false;
    }

    if (name.length > 100) {
      showMessage(
        'Garden name must not exceed 100 characters.',
        'danger'
      );
      return false;
    }

    if (!areaText || !Number.isFinite(area) || area <= 0) {
      showMessage(
        'Area must be a valid number greater than 0 square meters.',
        'danger'
      );
      return false;
    }

    if (!visitsText || !Number.isInteger(visits) || visits < 0) {
      showMessage(
        'Visit count must be a whole number greater than or equal to 0.',
        'danger'
      );
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (saving || !validateForm()) return;

    const garden = {
      gardenName: form.gardenName.trim(),
      areaSquareMeters: Number(form.areaSquareMeters),
      visitCount: Number(form.visitCount),
      active: form.active
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await axios.put(
          `${API_URL}/updateGardenDetails/${editingId}`,
          garden
        );
        showMessage('Garden updated successfully.');
      } else {
        await axios.post(`${API_URL}/add`, garden);
        showMessage('Garden added successfully.');
      }

      setForm({ ...emptyForm });
      setEditingId(null);

      const refreshed = await fetchGardens(false);

      if (!refreshed) {
        showMessage(
          'Garden saved successfully, but the records could not be refreshed. Click Refresh Records.',
          'warning'
        );
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          getApiErrorMessage(error, 'save garden details'),
        'danger'
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(garden) {
    setEditingId(garden.id);

    setForm({
      gardenName: garden.gardenName ?? '',
      areaSquareMeters: String(garden.areaSquareMeters ?? ''),
      visitCount: String(garden.visitCount ?? ''),
      active: garden.active ?? false
    });

    showMessage(`Editing garden ID ${garden.id}.`, 'info');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ ...emptyForm });
    showMessage('Edit cancelled.', 'info');
  }

  async function handleDelete(id) {
    if (!window.confirm(`Are you sure you want to delete garden ${id}?`)) {
      return;
    }

    setDeletingId(id);

    try {
      await axios.delete(`${API_URL}/delete/${id}`);

      setGardens((current) =>
        current.filter((garden) => garden.id !== id)
      );

      showMessage(`Garden ${id} was deleted successfully.`);
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          getApiErrorMessage(error, 'delete garden'),
        'danger'
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();

    const idText = searchId.trim();
    const id = Number(idText);

    if (!idText || !Number.isInteger(id) || id <= 0) {
      showMessage('Enter a valid positive garden ID.', 'danger');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/displayById/${id}`
      );

      if (!response.data || response.data.id == null) {
        setGardens([]);
        showMessage(`No garden found with ID ${id}.`, 'warning');
      } else {
        setGardens([response.data]);
        showMessage(`Garden ${id} found successfully.`);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setGardens([]);
        showMessage(`No garden found with ID ${id}.`, 'warning');
      } else {
        showMessage(
          getApiErrorMessage(error, 'search for the garden'),
          'danger'
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-success shadow">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#home">
            🌿 Garden Maintenance
          </a>
          <div className="d-flex gap-3">
            <a className="nav-link text-white" href="#form">
              Add Garden
            </a>
            <a className="nav-link text-white" href="#records">
              Garden Records
            </a>
          </div>
        </div>
      </nav>

      <main className="container py-4" id="home">
        <div className="text-center mb-4">
          <h1 className="fw-bold text-success">
            Garden Management System
          </h1>
          <p className="text-secondary">
            Add, view, update, and manage your garden maintenance records.
          </p>
        </div>

        {message && (
          <div
            className={`alert alert-${messageType} alert-dismissible fade show`}
            role="alert"
          >
            {message}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setMessage('')}
            />
          </div>
        )}

        <section className="card shadow-sm border-0 mb-4" id="form">
          <div className="card-header bg-success text-white py-3">
            <h5 className="mb-0">
              {editingId !== null
                ? '✏️ Update Garden'
                : '➕ Add New Garden'}
            </h5>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="gardenName">
                    Garden Name *
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="gardenName"
                    name="gardenName"
                    value={form.gardenName}
                    onChange={handleChange}
                    placeholder="Enter garden name"
                    maxLength={100}
                    required
                    aria-describedby="gardenNameHelp"
                  />
                  <small id="gardenNameHelp" className="text-secondary">
                    Maximum 100 characters.
                  </small>
                </div>

                <div className="col-md-6">
                  <label
                    className="form-label"
                    htmlFor="areaSquareMeters"
                  >
                    Area (square meters) *
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    id="areaSquareMeters"
                    name="areaSquareMeters"
                    value={form.areaSquareMeters}
                    onChange={handleChange}
                    min="0.01"
                    step="any"
                    placeholder="Enter garden area"
                    required
                  />
                  <small className="text-secondary">
                    Must be greater than zero.
                  </small>
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="visitCount">
                    Visit Count *
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    id="visitCount"
                    name="visitCount"
                    value={form.visitCount}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="Enter visit count"
                    required
                  />
                  <small className="text-secondary">
                    Enter a whole number, starting from zero.
                  </small>
                </div>

                <div className="col-md-6 d-flex align-items-center">
                  <div className="form-check form-switch mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="active"
                      name="active"
                      checked={form.active}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="active">
                      Maintenance Active
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 d-flex flex-wrap gap-2">
                <button
                  className="btn btn-success px-4"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingId !== null
                    ? 'Update Garden'
                    : 'Add Garden'}
                </button>

                {editingId !== null && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={cancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                )}

                <button
                  className="btn btn-outline-success"
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setForm({ ...emptyForm });
                    setEditingId(null);
                    setMessage('');
                  }}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="card shadow-sm border-0" id="records">
          <div className="card-header bg-white py-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <h5 className="mb-0">📋 Garden Records</h5>

              <button
                className="btn btn-outline-success btn-sm"
                type="button"
                onClick={() => fetchGardens()}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh Records'}
              </button>
            </div>

            <form
              onSubmit={handleSearch}
              className="d-flex flex-wrap gap-2 mt-3"
            >
              <input
                type="number"
                min="1"
                step="1"
                className="form-control"
                style={{ maxWidth: '260px' }}
                placeholder="Search by garden ID"
                aria-label="Search by garden ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />

              <button
                className="btn btn-success"
                type="submit"
                disabled={loading}
              >
                Search
              </button>

              <button
                className="btn btn-outline-secondary"
                type="button"
                disabled={loading}
                onClick={() => {
                  setSearchId('');
                  fetchGardens();
                }}
              >
                Show All
              </button>
            </form>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center p-5">
                <div
                  className="spinner-border text-success"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 mb-0">
                  Loading garden records...
                </p>
              </div>
            ) : gardens.length === 0 ? (
              <div className="text-center text-secondary p-5">
                <h6>No garden records found</h6>
                <p className="mb-0">
                  Try another ID, add a garden, or refresh the records.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-success">
                    <tr>
                      <th>ID</th>
                      <th>Garden Name</th>
                      <th>Area (m²)</th>
                      <th>Visits</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {gardens.map((garden) => (
                      <tr key={garden.id}>
                        <td>{garden.id}</td>
                        <td className="fw-semibold">
                          {garden.gardenName}
                        </td>
                        <td>{garden.areaSquareMeters}</td>
                        <td>{garden.visitCount}</td>
                        <td>
                          <span
                            className={`badge ${
                              garden.active
                                ? 'text-bg-success'
                                : 'text-bg-secondary'
                            }`}
                          >
                            {garden.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              type="button"
                              onClick={() => handleEdit(garden)}
                              disabled={deletingId !== null}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              type="button"
                              onClick={() => handleDelete(garden.id)}
                              disabled={deletingId !== null}
                            >
                              {deletingId === garden.id
                                ? 'Deleting...'
                                : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card-footer bg-white text-secondary small">
            Records displayed: {gardens.length}
          </div>
        </section>

        <footer className="text-center text-secondary py-4">
          Garden Maintenance Management System
        </footer>
      </main>
    </div>
  );
}

export default App;