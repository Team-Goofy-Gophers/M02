# crew/main_crew.py
from crewai import Crew
from tasks.ingestion_tasks import create_ingestion_tasks
from tasks.query_tasks import create_query_tasks

class CrewFactory:
    def create_ingestion_crew(self, file_path: str, chat_id: str) -> Crew:
        tasks = create_ingestion_tasks(file_path, chat_id)
        crew = Crew(
            agents=[task.agent for task in tasks],
            tasks=tasks,
            verbose=True,
        )
        return crew

    def create_query_crew(self, query: str, chat_id: str) -> Crew:
        tasks = create_query_tasks(query, chat_id)
        crew = Crew(
            agents=[task.agent for task in tasks],
            tasks=tasks,
            verbose=True,
            process="sequential",
            share_crew_output=True,
            # Remove any memory or callback settings that might trigger ChromaDB
            # memory=True,  # Removing this line
            # callbacks=[]  # Removing this line
        )
        return crew