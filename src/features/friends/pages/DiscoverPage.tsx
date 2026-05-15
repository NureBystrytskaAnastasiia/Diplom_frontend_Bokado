import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiGrid } from 'react-icons/fi';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import PeopleTab from '../components/PeopleTab/PeopleTab';
import GroupsTab from '../components/GroupsTab/GroupsTab';
import CreateGroupModal from '../../groups/components/CreateGroupModal/CreateGroupModal';
import '../styles/Discover.css';

type Tab = 'people' | 'groups';

const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

const DiscoverPage: React.FC = () => {
  const [activeTab, setActiveTab]           = useState<Tab>('people');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const handleGroupCreated = (groupId: number) => navigate(`/groups/${groupId}`);

  return (
    <AppLayout>
      <div className="discover">
        <header className="discover__header">
          <h1 className="discover__title">Пошук</h1>
          <p className="discover__subtitle">Знаходь людей та спільноти за інтересами</p>
        </header>

        {/* Tab switcher */}
        <div className="discover__tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'people'}
            className={`discover__tab ${activeTab === 'people' ? 'discover__tab--active' : ''}`}
            onClick={() => setActiveTab('people')}
          >
            <FiUsers size={16} />
            Люди
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'groups'}
            className={`discover__tab ${activeTab === 'groups' ? 'discover__tab--active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            <FiGrid size={16} />
            Групи
          </button>
        </div>

        {/* Tab content */}
        <div className="discover__content">
          <AnimatePresence mode="wait">
            {activeTab === 'people' && (
              <motion.div key="people" variants={tabVariants} initial="initial" animate="animate" exit="exit">
                <PeopleTab />
              </motion.div>
            )}
            {activeTab === 'groups' && (
              <motion.div key="groups" variants={tabVariants} initial="initial" animate="animate" exit="exit">
                <GroupsTab onCreateGroup={() => setShowCreateModal(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleGroupCreated}
        />
      )}
    </AppLayout>
  );
};

export default DiscoverPage;