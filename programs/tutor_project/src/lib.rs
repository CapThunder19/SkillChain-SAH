use anchor_lang::prelude::*;

declare_id!("DC5BMrRcTAQEk2N8B6eYzxDyuCWXjLVqP3MJEg8F2fgu");

#[program]
pub mod tutor_project {
    use super::*;

    pub fn create_tutor(ctx: Context<CreateTutor>, subject: String) -> Result<()> {
        require!(subject.len() <= 50, TutorError::SubjectTooLong);
        
        let tutor = &mut ctx.accounts.tutor;
        let clock = Clock::get()?;
        
        tutor.owner = ctx.accounts.user.key();
        tutor.subject = subject;
        tutor.level = 1;
        tutor.milestone_hash = [0u8; 32];
        tutor.last_updated = clock.unix_timestamp;
        
        msg!("Tutor profile created for subject: {}", tutor.subject);
        Ok(())
    }

    pub fn update_progress(
        ctx: Context<UpdateProgress>,
        new_level: u8,
        milestone_hash: [u8; 32],
    ) -> Result<()> {
        let tutor = &mut ctx.accounts.tutor;
        let clock = Clock::get()?;
        
        tutor.level = new_level;
        tutor.milestone_hash = milestone_hash;
        tutor.last_updated = clock.unix_timestamp;
        
        msg!("Progress updated - Level: {}", new_level);
        Ok(())
    }
}



#[derive(Accounts)]
pub struct CreateTutor<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Tutor::INIT_SPACE,
        seeds = [b"tutor", user.key().as_ref()],
        bump
    )]
    pub tutor: Account<'info, Tutor>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}



#[derive(Accounts)]
pub struct UpdateProgress<'info> {
    #[account(
        mut,
        seeds = [b"tutor", owner.key().as_ref()],
        bump,
        has_one = owner @ TutorError::Unauthorized
    )]
    pub tutor: Account<'info, Tutor>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
}



#[account]
#[derive(InitSpace)]
pub struct Tutor {
    pub owner: Pubkey,           
    #[max_len(50)]
    pub subject: String,         
    pub level: u8,               
    pub milestone_hash: [u8; 32], 
    pub last_updated: i64,       
}


#[error_code]
pub enum TutorError {
    #[msg("Subject must be 50 characters or less")]
    SubjectTooLong,
    #[msg("Only the tutor owner can update progress")]
    Unauthorized,
}
