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
            verbose=True
            # Removed process=tasks[0].agent.process_type
        )
        return crew

    def create_query_crew(self, query: str, chat_id: str) -> Crew:
        tasks = create_query_tasks(query, chat_id)
        crew = Crew(
            agents=[task.agent for task in tasks],
            tasks=tasks,
            verbose=True
            # Removed process=tasks[0].agent.process_type
        )
        return crew