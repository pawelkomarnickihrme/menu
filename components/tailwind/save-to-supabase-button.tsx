"use client";

import { Button } from "@/components/tailwind/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { revalidateMenu } from "../../lib/actions/getMenu";

export function SaveToSupabaseButton() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const content = window.localStorage.getItem("novel-content");
      const htmlContent = window.localStorage.getItem("html-content");
      const markdownContent = window.localStorage.getItem("markdown");

      const now = new Date();
      const { error } = await supabase.from("editor_documents").insert({
        user_id: user.id,
        title: `Document ${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`,
        content_json: content,
        content_html: htmlContent,
        content_markdown: markdownContent,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        active: true,
      });

      if (error) throw error;

      toast.success("Document saved to Supabase successfully!");
    } catch (error) {
      console.error("Error saving to Supabase:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save document"
      );
    } finally {
      revalidateMenu();
      setIsSaving(false);
    }
  };

  return (
    <Button
      onClick={handleSave}
      disabled={isSaving}
      size="sm"
      className="gap-2"
      variant="outline"
    >
      {isSaving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      {isSaving ? "Saving..." : "Save to Supabase"}
    </Button>
  );
}
