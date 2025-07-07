import React, { useState } from 'react';
import TranscriptList from '../components/TranscriptList';
import TranscriptEditorDialog from '../components/TranscriptEditorDialog';

const ViewTranscriptsPage = () => {
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (transcript) => {
    setSelectedTranscript(transcript);
    setEditorOpen(true);
  };

  const handleSave = (updated) => {
    // Here you would update the transcript in backend or state
    setEditorOpen(false);
    setSelectedTranscript(null);
    setRefreshTrigger((v) => v + 1);
    // Optionally show a success message
  };

  const handleClose = () => {
    setEditorOpen(false);
    setSelectedTranscript(null);
  };

  return (
    <div>
      <TranscriptList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
      <TranscriptEditorDialog
        open={editorOpen}
        transcript={selectedTranscript}
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  );
};

export default ViewTranscriptsPage; 