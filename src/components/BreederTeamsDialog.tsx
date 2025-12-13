"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetTeams, useCreateTeam, useDeleteTeam } from "@/lib/api/user";
import { Team } from "@/lib/types";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BreederTeamsDialogProps {
  breederId: number;
  breederName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteTeamButton({ team, breederId }: { team: Team; breederId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useDeleteTeam(breederId, team.idTeam);

  const handleDelete = () => {
    if (!mutate) return;
    mutate(
      {},
      {
        onSuccess: () => {
          toast.success("Team deleted successfully");
          setIsOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to delete team");
        },
      }
    );
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the team &quot;{team.teamName}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function BreederTeamsDialog({
  breederId,
  breederName,
  open,
  onOpenChange,
}: BreederTeamsDialogProps) {
  const [teamName, setTeamName] = useState("");

  const { data: teamsData, isPending } = useGetTeams(breederId);
  const createTeamMutation = useCreateTeam(breederId);

  const teams: Team[] = teamsData?.data || [];

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    try {
      if (createTeamMutation.mutateAsync) {
        await createTeamMutation.mutateAsync({ teamName: teamName.trim(), breederId });
      }
      toast.success("Team created successfully");
      setTeamName("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create team");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Teams</DialogTitle>
            <DialogDescription>
              Manage teams for {breederName} (ID: {breederId})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Create Team Section */}
            <div className="space-y-2">
              <Label htmlFor="teamName">Create New Team</Label>
              <div className="flex gap-2">
                <Input
                  id="teamName"
                  placeholder="Enter team name..."
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateTeam();
                    }
                  }}
                />
                <Button
                  onClick={handleCreateTeam}
                  disabled={createTeamMutation.isPending || !teamName.trim()}
                >
                  {createTeamMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span className="ml-2">Add</span>
                </Button>
              </div>
            </div>

            {/* Teams List Section */}
            <div className="space-y-2">
              <Label>Existing Teams ({teams.length})</Label>
              {isPending ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border rounded-md">
                  No teams created yet
                </div>
              ) : (
                <ScrollArea className="h-[300px] rounded-md border">
                  <div className="p-4 space-y-2">
                    {teams.map((team) => (
                      <div
                        key={team.idTeam}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{team.teamName}</span>
                          <span className="text-xs text-muted-foreground">
                            Team ID: {team.idTeam}
                          </span>
                        </div>
                        <DeleteTeamButton team={team} breederId={breederId} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
