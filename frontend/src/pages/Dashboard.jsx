import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';
import { IconTrash, IconEdit, IconPlus, IconClipboardList } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'motion/react';
import { CardContainer, CardBody, CardItem } from '../components/ui/3d-card';
import { FileUpload } from '../components/ui/file-upload';
import { Modal } from '../components/ui/modal';

import { Spotlight } from '../components/ui/spotlight';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [image, setImage] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('status', status);
      if (image) {
        formData.append('image', image);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        },
      };

      if (editingTask) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/tasks/${editingTask._id}`,
          formData,
          config
        );
        setEditingTask(null);
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/tasks`,
          formData,
          config
        );
      }

      setTitle('');
      setDescription('');
      setStatus('pending');
      setImage(null);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setImage(null); // Reset image input on edit start
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 relative overflow-hidden">
      <Spotlight className="-top-10 left-0 md:left-60 md:-top-20" fill="white" />
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Upload Image</h3>
          <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
            <FileUpload onChange={(files) => {
              if (files.length > 0) {
                setImage(files[0]);
                setShowUploadModal(false);
              }
            }} />
          </div>
        </div>
      </Modal>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Add/Edit Task Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20 dark:border-white/10">
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6 flex items-center gap-2">
                {editingTask ? (
                  <>
                    <IconEdit className="w-5 h-5 text-blue-500" /> Edit Task
                  </>
                ) : (
                  <>
                    <IconPlus className="w-5 h-5 text-emerald-500" /> New Task
                  </>
                )}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <LabelInputContainer>
                  <Label htmlFor="title" className="text-neutral-700 dark:text-neutral-300">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    required
                    className="bg-white/50 dark:bg-neutral-900/50"
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="description" className="text-neutral-700 dark:text-neutral-300">Description</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add some details..."
                    className="flex h-24 w-full rounded-xl border-none bg-white/50 dark:bg-neutral-900/50 px-3 py-2 text-sm text-black dark:text-white shadow-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="status" className="text-neutral-700 dark:text-neutral-300">Status</Label>
                  <div className="relative">
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="flex h-10 w-full appearance-none rounded-xl border-none bg-white/50 dark:bg-neutral-900/50 px-3 py-2 text-sm text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </LabelInputContainer>

                <div className="space-y-2">
                  <Label className="text-neutral-700 dark:text-neutral-300">Image (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <IconPlus className="w-4 h-4" />
                      {image ? 'Change Image' : 'Upload Image'}
                    </button>
                    {image && (
                      <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Image Selected
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {editingTask && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTask(null);
                        setTitle('');
                        setDescription('');
                        setStatus('pending');
                        setImage(null);
                      }}
                      className="flex-1 px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors font-medium text-sm"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 relative px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      </div>
                    ) : (
                      editingTask ? 'Update Task' : 'Create Task'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Task Grid */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Your Tasks</h2>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/10">
              {tasks.length} Tasks
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 border-dashed">
              <div className="w-16 h-16 bg-neutral-800/50 rounded-full flex items-center justify-center mb-4">
                <IconClipboardList className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-400 text-lg font-medium">No tasks yet</p>
              <p className="text-neutral-500 text-sm mt-1">Create your first task to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContainer className="inter-var w-full">
                      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
                        <div className="flex justify-between items-start">
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            {task.title}
                          </CardItem>

                          <CardItem translateZ="60" className="flex gap-2">
                            <button
                              onClick={() => handleEdit(task)}
                              className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                              title="Edit"
                            >
                              <IconEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(task._id)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Delete"
                            >
                              <IconTrash className="w-4 h-4" />
                            </button>
                          </CardItem>
                        </div>

                        <CardItem
                          as="p"
                          translateZ="60"
                          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 line-clamp-2"
                        >
                          {task.description || "No description provided."}
                        </CardItem>

                        {task.image && (
                          <CardItem translateZ="100" className="w-full mt-4">
                            <img
                              src={task.image}
                              height="1000"
                              width="1000"
                              className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt={task.title}
                            />
                          </CardItem>
                        )}

                        <div className="flex justify-between items-center mt-8">
                          <CardItem
                            translateZ={20}
                            className={cn(
                              'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                              task.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : task.status === 'in-progress'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            )}
                          >
                            {task.status}
                          </CardItem>
                          <CardItem
                            translateZ={20}
                            as="div"
                            className="text-xs text-neutral-500"
                          >
                            Created recently
                          </CardItem>
                        </div>
                      </CardBody>
                    </CardContainer>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      {children}
    </div>
  );
};

export default Dashboard;
