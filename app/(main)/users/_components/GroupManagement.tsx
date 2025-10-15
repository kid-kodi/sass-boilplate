// Group Management Section

"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Pencil, Plus, Trash2, Share2 } from "lucide-react";

// Dummy group data for demonstration
const initialGroups = [
  { id: 1, name: "Groupe A" },
  { id: 2, name: "Groupe B" },
  { id: 3, name: "Groupe C" },
  { id: 4, name: "Groupe D" },
  { id: 5, name: "Groupe E" },
  { id: 6, name: "Groupe F" },
  { id: 7, name: "Groupe G" },
];

export default function GroupManagement() {
  const [groups, setGroups] = useState(initialGroups);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<{
    id?: number;
    name: string;
  }>({ name: "" });

  // For selectable list
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentGroup({ name: "" });
    setOpen(true);
  };

  const handleOpenEdit = (group: { id: number; name: string }) => {
    setEditMode(true);
    setCurrentGroup(group);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentGroup({ name: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGroup({ ...currentGroup, name: e.target.value });
  };

  const handleSave = () => {
    if (editMode && currentGroup.id !== undefined) {
      setGroups(
        groups.map((g) =>
          g.id === currentGroup.id ? { ...g, name: currentGroup.name } : g
        )
      );
    } else {
      setGroups([...groups, { id: Date.now(), name: currentGroup.name }]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setGroups(groups.filter((g) => g.id !== id));
    setSelectedGroups((prev) => prev.filter((gid) => gid !== id));
  };

  // Selectable logic
  const handleSelectGroup = (id: number) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedGroups.length === groups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups.map((g) => g.id));
    }
  };

  const handleShareSelected = () => {
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };

  // For demonstration, just show group names in share dialog
  const selectedGroupNames = groups
    .filter((g) => selectedGroups.includes(g.id))
    .map((g) => g.name)
    .join(", ");

  return (
    <div className="max-w-7xl mx-auto px-6 py-5 mb-6">
      <div className="relative flex items-center">
        <button
          type="button"
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-1 hover:bg-gray-100 transition"
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            const container = document.getElementById("group-scroll-container");
            if (container) {
              container.scrollBy({ left: -200, behavior: "smooth" });
            }
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div
          id="group-scroll-container"
          className="flex overflow-x-auto space-x-4 no-scrollbar px-8"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {groups.map((group) => (
            <div
              key={group.id}
              className="group flex-shrink-0 bg-white border rounded-lg shadow px-4 py-2 min-w-[160px] text-center relative transition"
            >
              <div className="font-semibold text-gray-800">{group.name}</div>
              {/* Show edit/delete on hover */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="edit"
                  onClick={() => handleOpenEdit(group)}
                  className="text-muted-foreground hover:text-primary"
                  tabIndex={-1}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="delete"
                  onClick={() => handleDelete(group.id)}
                  className="text-muted-foreground hover:text-destructive"
                  tabIndex={-1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={handleOpenAdd}
          className="ml-4 flex-shrink-0"
          style={{
            position: "static",
            zIndex: 20,
            minWidth: 0,
            flex: "none",
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
        </Button>
        <button
          type="button"
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-1 hover:bg-gray-100 transition"
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            const container = document.getElementById("group-scroll-container");
            if (container) {
              container.scrollBy({ left: 200, behavior: "smooth" });
            }
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <style jsx global>{`
          .no-scrollbar {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none !important;
          }
        `}</style>
      </div>
      {/* <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Gestion des groupes</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleShareSelected}
            disabled={selectedGroups.length === 0}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager la sélection
          </Button>
          <Button onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un groupe
          </Button>
        </div>
      </div> */}
      {/* <div
        className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto"
        style={{
          maxHeight: 320,
          overflowY: "auto",
        }}
      >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {users.map((user) => (
            <div
              key={user._id || user._id}
              className="flex-shrink-0 bg-white border rounded-lg shadow px-4 py-2 min-w-[160px] text-center"
            >
              <div className="font-semibold text-gray-800">
                {user.fullName || user.email}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user.email}
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-gray-400 px-4 py-2">Aucun utilisateur</div>
          )}
        </div>
      </div>
        <ul className="divide-y divide-gray-100 min-w-[400px]">
          <li className="flex items-center px-4 py-2 bg-gray-50 sticky top-0 z-10 min-w-[400px]">
            <input
              type="checkbox"
              checked={selectedGroups.length === groups.length && groups.length > 0}
              onChange={handleSelectAll}
              className="mr-3"
              aria-label="Tout sélectionner"
            />
            <span className="text-sm font-medium flex-1">Nom du groupe</span>
            <span className="w-24 text-right text-xs text-gray-400">Actions</span>
          </li>
          {groups.map((group) => (
            <li
              key={group.id}
              className={`flex items-center justify-between px-4 py-2 group hover:bg-gray-50 transition min-w-[400px] ${
                selectedGroups.includes(group.id) ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  checked={selectedGroups.includes(group.id)}
                  onChange={() => handleSelectGroup(group.id)}
                  className="mr-3"
                  aria-label={`Sélectionner ${group.name}`}
                />
                <span className="text-sm">{group.name}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="edit"
                  onClick={() => handleOpenEdit(group)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="delete"
                  onClick={() => handleDelete(group.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
          {groups.length === 0 && (
            <li className="px-4 py-2 text-sm text-muted-foreground min-w-[400px]">
              Aucun groupe
            </li>
          )}
        </ul>
      </div> */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Modifier le groupe" : "Ajouter un groupe"}
            </DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Nom du groupe"
            value={currentGroup.name}
            onChange={handleChange}
            className="mt-2 mb-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={!currentGroup.name.trim()}>
              {editMode ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Partager les groupes sélectionnés</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            {selectedGroups.length === 0 ? (
              <span className="text-muted-foreground text-sm">
                Aucun groupe sélectionné.
              </span>
            ) : (
              <span className="text-sm">
                Groupes sélectionnés : <b>{selectedGroupNames}</b>
              </span>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseShareDialog}>
              Fermer
            </Button>
            {/* Here you could add a real share action */}
            <Button
              onClick={() => {
                // Simulate share
                alert(`Groupes partagés : ${selectedGroupNames || "Aucun"}`);
                setShareDialogOpen(false);
              }}
              disabled={selectedGroups.length === 0}
            >
              Partager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
