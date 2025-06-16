import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content_json, content_html, content_markdown } = body;

    // Validate required fields
    if (!content_json) {
      return NextResponse.json(
        { error: "Content JSON is required" },
        { status: 400 }
      );
    }

    // Save to database
    const { data, error } = await supabase
      .from("editor_documents")
      .insert({
        user_id: user.id,
        title: title || `Document ${new Date().toLocaleDateString()}`,
        content_json,
        content_html,
        content_markdown,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to save document" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      document: data,
      message: "Document saved successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
