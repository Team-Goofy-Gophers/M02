from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task, before_kickoff, after_kickoff
from crew_implementation.tools.docx_tool import DocxToMarkdownTool
from crew_implementation.tools.csv_tool import CsvToMarkdownTool
from crew_implementation.tools.pdf_tool import PdfToMarkdownTool
from crew_implementation.tools.image_tool import ImageToMarkdownTool
from crew_implementation.tools.xlsx_tool import XlsxToMarkdownTool

# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class CrewImplementation():
    """CrewImplementation crew"""
    @before_kickoff
    def before_kickoff_function(self, inputs):
        print(f"Before kickoff function with inputs: {inputs}")
        return inputs # You can return the inputs or modify them as needed

    @after_kickoff
    def after_kickoff_function(self, result):
        print(f"After kickoff function with result: {result}")
        return result # You can return the result or modify it as needed
    # Learn more about YAML configuration files here:
    # Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
    # Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    # If you would like to add tools to your agents, you can learn more about it here:
    # https://docs.crewai.com/concepts/agents#agent-tools
    @agent
    def docx_processor(self) -> Agent:
        return Agent(
            config=self.agents_config['docx_processor'],
            verbose=True,
            tools=[DocxToMarkdownTool()] 
        )

    @agent
    def csv_processor(self) -> Agent:
        return Agent(
            config=self.agents_config['csv_processor'],
            verbose=True,
            tools=[CsvToMarkdownTool()]
        )

    @agent
    def pdf_processor(self) -> Agent:
        return Agent(
            config=self.agents_config['pdf_processor'],
            verbose=True,
            tools=[PdfToMarkdownTool()]
        )

    @agent
    def image_processor(self) -> Agent:
        return Agent(
            config=self.agents_config['image_processor'],
            verbose=True,
            tools=[ImageToMarkdownTool()]
        )

    @agent
    def xlsx_processor(self) -> Agent:
        return Agent(
            config=self.agents_config['xlsx_processor'],
            verbose=True,
            tools=[XlsxToMarkdownTool()]
        )

    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def docx_processing_task(self) -> Task:
        return Task(
            config=self.tasks_config['docx_processing_task'],
        )

    @task
    def csv_processing_task(self) -> Task:
        return Task(
            config=self.tasks_config['csv_processing_task'],
        )

    @task
    def pdf_processing_task(self) -> Task:
        return Task(
            config=self.tasks_config['pdf_processing_task'],
        )

    @task
    def image_processing_task(self) -> Task:
        return Task(
            config=self.tasks_config['image_processing_task'],
        )

    @task
    def excel_processing_task(self) -> Task:
        return Task(
            config=self.tasks_config['excel_processing_task'],
        )

    @crew
    def crew(self) -> Crew:
        """Creates the CrewImplementation crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )
