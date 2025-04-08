def validate_sources(response, authorized_sources):
    """
    Validates that only authorized sources are mentioned in the response.
    
    Args:
        response (str): The final response from the agent
        authorized_sources (list): List of authorized source file names
    
    Returns:
        tuple: (bool, str) - (is_valid, corrected_response)
    """
    if not response or not authorized_sources:
        return True, response
    
    # Extract the Files Used section
    if "Files Used:" in response:
        before_files, after_files = response.split("Files Used:", 1)
        files_section = after_files.strip()
        
        # Check each line in the files section
        unauthorized_files = []
        lines = files_section.split("\n")
        for line in lines:
            # Skip empty lines or numbering
            line = line.strip()
            if not line or line.isdigit() or line.startswith("-"):
                continue
            
            # Remove numbers and bullets
            file_name = line.lstrip("0123456789.- ").strip()
            if file_name and not any(source in file_name for source in authorized_sources):
                unauthorized_files.append(file_name)
        
        if unauthorized_files:
            # Correct the response to only include authorized sources
            corrected_files = [source for source in authorized_sources if any(source in line for line in lines)]
            corrected_section = "Files Used:\n"
            for i, file in enumerate(corrected_files):
                corrected_section += f"{i+1}. {file}\n"
            
            corrected_response = before_files + corrected_section
            return False, corrected_response
    
    return True, response
