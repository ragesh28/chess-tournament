<script>
  import { players, playerParticipation, PlayerActions } from '../lib/stores.js';
  import Modal from './Modal.svelte';
  import AppIcon from './AppIcon.svelte';

  let searchQuery = '';
  let isAddModalOpen = false;
  let isEditModalOpen = false;
  let isDeleteModalOpen = false;

  let newPlayerName = '';
  let editingId = null;
  let editingName = '';
  let deletingPlayer = null;

  let modalError = '';

  // Filtered players based on search query
  $: filteredPlayers = $players.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  function openAddModal() {
    newPlayerName = '';
    modalError = '';
    isAddModalOpen = true;
  }

  function handleCreate() {
    if (!newPlayerName.trim()) {
      modalError = 'Please enter a valid player name.';
      return;
    }
    try {
      PlayerActions.create(newPlayerName);
      isAddModalOpen = false;
      newPlayerName = '';
    } catch (err) {
      modalError = err.message;
    }
  }

  function openEditModal(player) {
    editingId = player.id;
    editingName = player.name;
    modalError = '';
    isEditModalOpen = true;
  }

  function handleUpdate() {
    if (!editingName.trim()) {
      modalError = 'Player name cannot be empty.';
      return;
    }
    try {
      PlayerActions.update(editingId, editingName);
      isEditModalOpen = false;
      editingId = null;
      editingName = '';
    } catch (err) {
      modalError = err.message;
    }
  }

  function openDeleteModal(player) {
    deletingPlayer = player;
    modalError = '';
    isDeleteModalOpen = true;
  }

  function confirmDelete() {
    if (!deletingPlayer) return;
    try {
      PlayerActions.delete(deletingPlayer.id);
      isDeleteModalOpen = false;
      deletingPlayer = null;
    } catch (err) {
      modalError = err.message;
    }
  }
</script>

<div class="player-manager">
  <!-- Page Header -->
  <div class="header-card card">
    <div class="header-left">
      <h2>Master Player Roster</h2>
      <p class="text-secondary">
        Directory of all registered chess competitors across current and historical tournaments.
      </p>
    </div>
    <div class="header-actions">
      <button class="btn btn-primary" on:click={openAddModal}>
        <AppIcon name="plus" />
        <span>Register Player</span>
      </button>
    </div>
  </div>

  <!-- Filter & Stats Bar -->
  <div class="filter-bar">
    <div class="search-box">
      <AppIcon name="search" className="search-icon" />
      <input
        type="text"
        class="form-control search-input"
        placeholder="Search players by name..."
        bind:value={searchQuery}
      />
      {#if searchQuery}
        <button class="clear-search" on:click={() => (searchQuery = '')} aria-label="Clear search"><AppIcon name="close" /></button>
      {/if}
    </div>
    <div class="roster-meta text-secondary text-sm">
      Showing <strong>{filteredPlayers.length}</strong> of {$players.length} players
    </div>
  </div>

  <!-- Main Roster Table -->
  <div class="card table-card">
    {#if $players.length === 0}
      <div class="empty-state">
        <AppIcon name="player" className="empty-icon" />
        <h3>No Players Registered</h3>
        <p class="text-muted text-sm">Get started by adding your first competitor or click "Demo Data" above.</p>
        <button class="btn btn-primary btn-sm" on:click={openAddModal}>
          <span>+ Add First Player</span>
        </button>
      </div>
    {:else if filteredPlayers.length === 0}
      <div class="empty-state">
        <AppIcon name="search" className="empty-icon" />
        <h3>No matching players found</h3>
        <p class="text-muted text-sm">No player matched your search query "{searchQuery}".</p>
        <button class="btn btn-secondary btn-sm" on:click={() => (searchQuery = '')}>
          <span>Clear Search</span>
        </button>
      </div>
    {:else}
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 60px;">#</th>
              <th>Player Name</th>
              <th>Tournament Participation</th>
              <th>Registration Date</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredPlayers as player, index (player.id)}
              {@const tourneyCount = $playerParticipation.get(player.id) || 0}
              <tr>
                <td class="text-muted">{index + 1}</td>
                <td>
                  <div class="player-cell">
                    <div class="avatar-badge"><AppIcon name="player" /></div>
                    <div class="player-details">
                      <span class="player-name">{player.name}</span>
                      <span class="player-id text-muted text-sm">ID: {player.id.substring(0, 10)}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge {tourneyCount > 0 ? 'badge-in_progress' : 'badge-draft'}">
                    {tourneyCount} {tourneyCount === 1 ? 'Tournament' : 'Tournaments'}
                  </span>
                </td>
                <td class="text-secondary text-sm">
                  {new Date(player.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
                <td style="text-align: right;">
                  <div class="action-btn-group">
                    <button
                      class="btn btn-secondary btn-sm"
                      on:click={() => openEditModal(player)}
                      title="Edit player name"
                    >
                      <AppIcon name="edit" />
                      <span>Edit</span>
                    </button>
                    <button
                      class="btn btn-danger btn-sm"
                      on:click={() => openDeleteModal(player)}
                      title="Delete player from roster"
                    >
                      <AppIcon name="trash" />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<!-- Modal 1: Add Player -->
<Modal title="Register New Player" isOpen={isAddModalOpen} on:close={() => (isAddModalOpen = false)}>
  <form on:submit|preventDefault={handleCreate}>
    {#if modalError}
      <div class="alert alert-danger" style="margin-bottom: 1rem;">
        <AppIcon name="alert" />
        <span>{modalError}</span>
      </div>
    {/if}

    <div class="form-group">
      <label class="form-label" for="addPlayerName">Player Full Name</label>
      <input
        id="addPlayerName"
        type="text"
        class="form-control"
        placeholder="e.g. Magnus Carlsen"
        bind:value={newPlayerName}
      />
      <span class="text-muted text-sm" style="display: block; margin-top: 0.35rem;">
        The player will be immediately available to enroll into any tournament.
      </span>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
      <button type="button" class="btn btn-secondary" on:click={() => (isAddModalOpen = false)}>
        Cancel
      </button>
      <button type="submit" class="btn btn-primary">
        Register Player
      </button>
    </div>
  </form>
</Modal>

<!-- Modal 2: Edit Player -->
<Modal title="Edit Player Name" isOpen={isEditModalOpen} on:close={() => (isEditModalOpen = false)}>
  <form on:submit|preventDefault={handleUpdate}>
    {#if modalError}
      <div class="alert alert-danger" style="margin-bottom: 1rem;">
        <AppIcon name="alert" />
        <span>{modalError}</span>
      </div>
    {/if}

    <div class="form-group">
      <label class="form-label" for="editPlayerName">Player Name</label>
      <input
        id="editPlayerName"
        type="text"
        class="form-control"
        bind:value={editingName}
      />
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
      <button type="button" class="btn btn-secondary" on:click={() => (isEditModalOpen = false)}>
        Cancel
      </button>
      <button type="submit" class="btn btn-success">
        Save Changes
      </button>
    </div>
  </form>
</Modal>

<!-- Modal 3: Confirm Delete Player -->
<Modal title="Confirm Player Deletion" isOpen={isDeleteModalOpen} on:close={() => (isDeleteModalOpen = false)}>
  <div>
    {#if modalError}
      <div class="alert alert-danger" style="margin-bottom: 1rem;">
        <AppIcon name="alert" />
        <span>{modalError}</span>
      </div>
    {/if}

    <p>
      Are you sure you want to delete competitor <strong>"{deletingPlayer ? deletingPlayer.name : ''}"</strong>?
    </p>
    <p class="text-secondary text-sm" style="margin-top: 0.5rem;">
      This action removes them from the master roster and un-enrolls them from any draft events.
    </p>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
      <button type="button" class="btn btn-secondary" on:click={() => (isDeleteModalOpen = false)}>
        Cancel
      </button>
      <button type="button" class="btn btn-danger" on:click={confirmDelete}>
        Delete Player
      </button>
    </div>
  </div>
</Modal>

<style>
  .player-manager {
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

  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 340px;
    max-width: 100%;
  }

  :global(.search-icon) {
    position: absolute;
    left: 0.875rem;
    width: 0.875rem;
    height: 0.875rem;
    opacity: 0.6;
    pointer-events: none;
  }

  .search-input {
    padding-left: 2.35rem;
    padding-right: 2rem;
  }

  .clear-search {
    position: absolute;
    right: 0.75rem;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.75rem;
  }

  .clear-search:hover {
    color: var(--text-primary);
  }

  .table-card {
    padding: 0;
    overflow: hidden;
  }

  .player-cell {
    display: flex;
    align-items: center;
    gap: 0.875rem;
  }

  .avatar-badge {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background-color: var(--bg-card-alt);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    color: var(--primary);
  }

  .player-details {
    display: flex;
    flex-direction: column;
  }

  .player-name {
    font-weight: 700;
    color: var(--text-primary);
  }

  .action-btn-group {
    display: inline-flex;
    gap: 0.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  :global(.empty-icon) {
    width: 3rem;
    height: 3rem;
    opacity: 0.4;
  }

  .text-sm {
    font-size: 0.8125rem;
  }
</style>
