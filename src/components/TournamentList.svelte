<script>
  import { tournaments, activeTournamentId, currentTab, TournamentActions } from '../lib/stores.js';
  import Modal from './Modal.svelte';
  import AppIcon from './AppIcon.svelte';

  let filterStatus = 'all'; // 'all' | 'draft' | 'in_progress' | 'completed'
  let isCreateModalOpen = false;
  let isRenameModalOpen = false;
  let isDeleteModalOpen = false;

  let newTournamentTitle = '';
  let editingId = null;
  let editingTitle = '';
  let deletingTournament = null;
  let modalError = '';

  $: filteredTournaments = $tournaments.filter(t => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  function openCreateModal() {
    newTournamentTitle = '';
    modalError = '';
    isCreateModalOpen = true;
  }

  function handleCreate() {
    if (!newTournamentTitle.trim()) {
      modalError = 'Please enter a valid tournament title.';
      return;
    }
    try {
      const created = TournamentActions.create(newTournamentTitle);
      isCreateModalOpen = false;
      newTournamentTitle = '';
      openTournament(created.id);
    } catch (err) {
      modalError = err.message;
    }
  }

  function openTournament(id) {
    activeTournamentId.set(id);
    currentTab.set('tournament-detail');
  }

  function openRenameModal(tourney) {
    editingId = tourney.id;
    editingTitle = tourney.title;
    modalError = '';
    isRenameModalOpen = true;
  }

  function handleRename() {
    if (!editingTitle.trim()) {
      modalError = 'Tournament title cannot be empty.';
      return;
    }
    try {
      TournamentActions.update(editingId, editingTitle);
      isRenameModalOpen = false;
      editingId = null;
      editingTitle = '';
    } catch (err) {
      modalError = err.message;
    }
  }

  function openDeleteModal(tourney) {
    deletingTournament = tourney;
    modalError = '';
    isDeleteModalOpen = true;
  }

  function confirmDelete() {
    if (!deletingTournament) return;
    try {
      TournamentActions.delete(deletingTournament.id);
      isDeleteModalOpen = false;
      deletingTournament = null;
    } catch (err) {
      modalError = err.message;
    }
  }
</script>

<div class="tournament-list-view">
  <!-- Header Banner -->
  <div class="header-card card">
    <div class="header-left">
      <h2>Tournaments Directory</h2>
      <p class="text-secondary">
        Create, organize, and monitor chess tournaments across all competition stages.
      </p>
    </div>
    <div class="header-actions">
      <button class="btn btn-primary" on:click={openCreateModal}>
        <AppIcon name="trophy" />
        <span>Create Tournament</span>
      </button>
    </div>
  </div>

  <!-- Filter & Controls -->
  <div class="filter-row">
    <div class="status-pills">
      <button
        class="filter-pill {filterStatus === 'all' ? 'active' : ''}"
        on:click={() => (filterStatus = 'all')}
      >
        All Events ({$tournaments.length})
      </button>
      <button
        class="filter-pill {filterStatus === 'draft' ? 'active' : ''}"
        on:click={() => (filterStatus = 'draft')}
      >
        Draft
      </button>
      <button
        class="filter-pill {filterStatus === 'in_progress' ? 'active' : ''}"
        on:click={() => (filterStatus = 'in_progress')}
      >
        In Progress
      </button>
      <button
        class="filter-pill {filterStatus === 'completed' ? 'active' : ''}"
        on:click={() => (filterStatus = 'completed')}
      >
        Completed
      </button>
    </div>
  </div>

  <!-- Tournaments Card Grid -->
  {#if $tournaments.length === 0}
    <div class="card empty-state">
      <AppIcon name="trophy" className="empty-icon" />
      <h3>No Tournaments Created</h3>
      <p class="text-muted text-sm">Create your first chess tournament or click "Demo Data" above to start.</p>
      <button class="btn btn-primary btn-sm" on:click={openCreateModal}>
        <span>+ Create Tournament</span>
      </button>
    </div>
  {:else if filteredTournaments.length === 0}
    <div class="card empty-state">
      <AppIcon name="folder" className="empty-icon" />
      <h3>No {filterStatus.replace('_', ' ')} tournaments</h3>
      <p class="text-muted text-sm">There are currently no events matching this status filter.</p>
      <button class="btn btn-secondary btn-sm" on:click={() => (filterStatus = 'all')}>
        <span>Show All Tournaments</span>
      </button>
    </div>
  {:else}
    <div class="tournaments-grid">
      {#each filteredTournaments as tourney (tourney.id)}
        <div class="tourney-card card">
          <div class="tourney-card-header">
            <div class="tourney-title-box">
              <AppIcon name="trophy" className="trophy-badge" />
              <h3 class="tourney-name">{tourney.title}</h3>
            </div>
            <span class="badge badge-{tourney.status}">
              {tourney.status.replace('_', ' ')}
            </span>
          </div>

          <div class="tourney-stats">
            <div class="stat-pill">
              <span class="stat-num">{tourney.playerIds.length}</span>
              <span class="stat-label">Enrolled</span>
            </div>
            <div class="stat-pill">
              <span class="stat-num">
                {new Date(tourney.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <span class="stat-label">Date Created</span>
            </div>
          </div>

          <div class="tourney-card-actions">
            <button class="btn btn-primary" on:click={() => openTournament(tourney.id)}>
              <span>Open Dashboard →</span>
            </button>
            <div class="mini-actions">
              <button
                class="btn btn-secondary btn-sm"
                on:click={() => openRenameModal(tourney)}
                title="Rename tournament"
              >
                <AppIcon name="edit" />
              </button>
              <button
                class="btn btn-danger btn-sm"
                on:click={() => openDeleteModal(tourney)}
                title="Delete tournament"
              >
                <AppIcon name="trash" />
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Modal 1: Create Tournament -->
<Modal title="Create New Tournament" isOpen={isCreateModalOpen} on:close={() => (isCreateModalOpen = false)}>
  <form on:submit|preventDefault={handleCreate}>
    {#if modalError}
      <div class="alert alert-danger" style="margin-bottom: 1rem;">
        <AppIcon name="alert" />
        <span>{modalError}</span>
      </div>
    {/if}

    <div class="form-group">
      <label class="form-label" for="newTourneyTitle">Tournament Title</label>
      <input
        id="newTourneyTitle"
        type="text"
        class="form-control"
        placeholder="e.g. FIDE Candidates 2026"
        bind:value={newTournamentTitle}
      />
      <span class="text-muted text-sm" style="display: block; margin-top: 0.35rem;">
        The tournament will be created in Draft status ready for player enrollment.
      </span>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
      <button type="button" class="btn btn-secondary" on:click={() => (isCreateModalOpen = false)}>
        Cancel
      </button>
      <button type="submit" class="btn btn-primary">
        Create Tournament
      </button>
    </div>
  </form>
</Modal>

<!-- Modal 2: Rename Tournament -->
<Modal title="Rename Tournament" isOpen={isRenameModalOpen} on:close={() => (isRenameModalOpen = false)}>
  <form on:submit|preventDefault={handleRename}>
    {#if modalError}
      <div class="alert alert-danger" style="margin-bottom: 1rem;">
        <AppIcon name="alert" />
        <span>{modalError}</span>
      </div>
    {/if}

    <div class="form-group">
      <label class="form-label" for="editTourneyTitle">Tournament Title</label>
      <input
        id="editTourneyTitle"
        type="text"
        class="form-control"
        bind:value={editingTitle}
      />
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
      <button type="button" class="btn btn-secondary" on:click={() => (isRenameModalOpen = false)}>
        Cancel
      </button>
      <button type="submit" class="btn btn-success">
        Save Title
      </button>
    </div>
  </form>
</Modal>

<!-- Modal 3: Confirm Delete Tournament -->
<Modal title="Confirm Tournament Deletion" isOpen={isDeleteModalOpen} on:close={() => (isDeleteModalOpen = false)}>
  <div>
    {#if modalError}
      <div class="alert alert-danger" style="margin-bottom: 1rem;">
        <AppIcon name="alert" />
        <span>{modalError}</span>
      </div>
    {/if}

    <p>
      Are you sure you want to delete tournament <strong>"{deletingTournament ? deletingTournament.title : ''}"</strong>?
    </p>
    <p class="text-secondary text-sm" style="margin-top: 0.5rem;">
      All match records and standing data associated with this event will be permanently removed.
    </p>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
      <button type="button" class="btn btn-secondary" on:click={() => (isDeleteModalOpen = false)}>
        Cancel
      </button>
      <button type="button" class="btn btn-danger" on:click={confirmDelete}>
        Delete Tournament
      </button>
    </div>
  </div>
</Modal>

<style>
  .tournament-list-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .filter-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status-pills {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .filter-pill {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.4rem 0.875rem;
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .filter-pill:hover {
    color: var(--text-primary);
    border-color: var(--primary);
  }

  .filter-pill.active {
    background-color: var(--primary);
    border-color: var(--primary);
    color: #ffffff;
  }

  .tournaments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.25rem;
  }

  .tourney-card {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.5rem;
    transition: transform 0.15s ease, border-color 0.15s ease;
  }

  .tourney-card:hover {
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.4);
  }

  .tourney-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .tourney-title-box {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .trophy-badge {
    width: 1.25rem;
    height: 1.25rem;
  }

  .tourney-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.3;
  }

  .tourney-stats {
    display: flex;
    gap: 1rem;
    background-color: var(--bg-main);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 0.75rem 1rem;
  }

  .stat-pill {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .stat-num {
    font-weight: 800;
    font-size: 1rem;
    color: var(--text-primary);
  }

  .stat-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .tourney-card-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    margin-top: auto;
  }

  .mini-actions {
    display: flex;
    gap: 0.35rem;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .empty-icon {
    width: 3rem;
    height: 3rem;
    opacity: 0.4;
  }

  .text-sm {
    font-size: 0.8125rem;
  }
</style>
