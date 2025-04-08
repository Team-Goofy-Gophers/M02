import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight, FileText, Database, Zap } from "lucide-react";

const Home = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <section className="mt-16 flex w-full justify-center bg-gradient-to-b from-white to-slate-50 py-20">
        <div className="container flex flex-col items-center text-center">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Transform unstructured documents into tailored datasets with AI
            agents
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg">
            Extract meaningful insights from any document type using natural
            language prompts and adaptive AI agents.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2">
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {/* TODO(Omkar): Add youtube link */}
            <Link href="#demo">
              <Button variant="outline" size="lg">
                See it in action
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            The Document Intelligence Platform
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <FileText className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">The Problem</h3>
              <p className="text-muted-foreground">
                Manual data extraction is time-consuming. Traditional tools are
                rigid and can&apos;t adapt to diverse document formats.
              </p>
            </div>

            <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Database className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Our Solution</h3>
              <p className="text-muted-foreground">
                Natural language prompts drive adaptive extraction, creating
                flexible schemas that match your exact needs.
              </p>
            </div>

            <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Zap className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">The Benefits</h3>
              <p className="text-muted-foreground">
                Save hours of manual work, discover hidden insights, and
                transform any document into structured, actionable data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center bg-slate-50 py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full text-white">
                1
              </div>
              <h3 className="mt-4 text-xl font-semibold">Upload Documents</h3>
              <p className="text-muted-foreground mt-2">
                Drag and drop any document type: PDF, DOCX, CSV, TXT, JSON, or
                images.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full text-white">
                2
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Ask in Plain Language
              </h3>
              <p className="text-muted-foreground mt-2">
                Tell our AI what data you need using natural language prompts.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full text-white">
                3
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Get Structured Data
              </h3>
              <p className="text-muted-foreground mt-2">
                Receive clean, structured datasets ready for analysis or export.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary flex w-full justify-center py-20 text-white">
        <div className="container flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to transform your document workflow?
          </h2>
          <p className="text-primary-foreground/90 mt-4 max-w-2xl">
            Join thousands of professionals who are saving time and gaining
            insights with our document intelligence platform.
          </p>
          <Link href="/auth/signup" className="mt-8">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
