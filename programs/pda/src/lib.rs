use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke_signed;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod pda {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>,) -> ProgramResult {
        Ok(())
    }

    pub fn send_sol(ctx: Context<SendSol>, amount: u64, bump: u8) -> ProgramResult {

        let ix = system_instruction::transfer(
            ctx.accounts.pda.key,
            ctx.accounts.to.key,
            amount
        );
        
        invoke_signed(
            &ix,
            &[
                ctx.accounts.pda.to_account_info(),
                ctx.accounts.to.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[&[b"test", &[bump]]],
        )?;

        Ok(())
    } 
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct SendSol<'info> {
    #[account(mut)]
    to: SystemAccount<'info>,
    #[account(mut)]
    pda: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
