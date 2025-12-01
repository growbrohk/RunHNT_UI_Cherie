import { useState, useEffect } from "react"; // ⬅️ NEW: Import useEffect
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import frogRunner from "@/assets/frog-runner.png";

// ⬅️ NEW: Interface for fetching team data
interface Team {
  id: number;
  team_name: string;
}

const EntryView = () => {
  const [code, setCode] = useState("");
  // ⬅️ CHANGED: Replace team (string) with selectedTeamId (number)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null); 
  // ⬅️ NEW: State to hold the fetched list of teams
  const [teams, setTeams] = useState<Team[]>([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⬅️ NEW: Effect to fetch teams from the database on load
  useEffect(() => {
    const fetchTeams = async () => {
        const { data, error } = await supabase
            .from('teams')
            .select('id, team_name') // Fetch both ID and Name
            .order('id', { ascending: true }); // Order by ID

        if (error) {
            console.error("Error fetching teams:", error);
            toast.error("Failed to load team data.");
        } else {
            setTeams(data || []);
        }
    };
    fetchTeams();
  }, []); // Run only once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ⬅️ CHANGED: Check against the new selectedTeamId state
    if (!code || selectedTeamId === null) { 
      toast.error("Please fill in all fields");
      return;
    }

    if (code.length !== 7) {
      toast.error("Treasure code must be 7 digits");
      return;
    }

    setIsSubmitting(true);

    try {
      // Input must be parsed to integer to match the DB column type
      const numericCode = parseInt(code, 10);

      // Step 1: Look up treasure code
      const { data: treasureData, error: lookupError } = await supabase
        .from("game_treasures")
        .select("id")
        .eq("code_entry", numericCode)
        .maybeSingle();

      if (lookupError) {
        console.error("Lookup error:", lookupError);
        toast.error(`DB Error: ${lookupError.message}`);
        return;
      }

      if (!treasureData) {
        toast.error("Treasure code not found");
        return;
      }

      // Step 2: Insert entry — CRITICAL FIX HERE
      const { error: insertError } = await supabase
        .from("entry")
        .insert({
         game_treasure_id: treasureData.id,
          // ⬅️ CRITICAL FIX: Submit team_id instead of the old 'team' string
          team_id: selectedTeamId, 
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        toast.error(`Insert Error: ${insertError.message}`); // Show specific error
        return;
      }

      toast.success("Entry submitted successfully!");
      setCode("");
      // ⬅️ Reset the team ID state
      setSelectedTeamId(null); 

    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 min-h-[calc(100vh-8.5rem)]">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-2">
          {/* Note: The frog image is still here, but you can update/remove the asset file */}
          <img 
            src={frogRunner} 
            alt="Running frog mascot" 
            className="w-48 h-48 object-contain"
          />
          <h2 className="text-2xl font-bold">Entry</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-base font-semibold">
              1. Enter a Treasure code
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="7 digits numbers"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 7))
              }
              className="text-center text-lg h-12"
              maxLength={7}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team" className="text-base font-semibold">
              2. Your Team
            </Label>
            {/* ⬅️ CHANGED: Use selectedTeamId state and handle changes as numbers */}
            <Select 
              value={selectedTeamId ? String(selectedTeamId) : ""} 
              onValueChange={(value) => setSelectedTeamId(Number(value))}
            >
              <SelectTrigger id="team" className="h-12">
                <SelectValue placeholder="Select your team" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {/* ⬅️ CRITICAL FIX: Map over the fetched 'teams' data */}
                {teams.map((team) => (
                  <SelectItem key={team.id} value={String(team.id)}>
                    {team.team_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg rounded-full"
            // ⬅️ CHANGED: Disable button if selectedTeamId is null
            disabled={isSubmitting || !selectedTeamId || !code} 
          >
            {isSubmitting ? "Submitting..." : "next"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EntryView;
